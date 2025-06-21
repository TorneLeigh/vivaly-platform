import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { z } from "zod";
import { insertUserSchema, insertJobSchema, insertApplicationSchema, type InsertUser } from "@shared/schema";
import { requireAuth, requireRole } from "./auth-middleware";
import { sendPasswordResetEmail } from "./email-service";
import { sendEmail, notifyOwner } from "./lib/sendEmail";
import { sendUserRegistrationNotification, sendDocumentSubmissionNotification, sendTestEmails, sendJobPostingNotification, sendJobApplicationNotification, sendMessageNotification, sendBookingNotification } from "./email-notifications";
import multer from "multer";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure multer for file uploads
  const upload = multer({ dest: "uploads/" });

  // Serve uploaded files statically
  const staticMiddleware = express.static("uploads");
  app.use("/uploads", staticMiddleware);

  // Video upload endpoint
  app.post("/api/upload-intro-video", requireAuth, upload.single("video"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ message: "No video uploaded" });

      const ext = path.extname(file.originalname);
      const newPath = path.join("uploads", `${file.filename}${ext}`);
      fs.renameSync(file.path, newPath);

      const videoUrl = `/uploads/${file.filename}${ext}`;

      return res.json({ url: videoUrl });
    } catch (error) {
      console.error("Video upload error:", error);
      res.status(500).json({ message: "Failed to upload video" });
    }
  });

  // Document upload endpoint for police check and WWCC
  app.post("/api/upload-document", requireAuth, upload.single("document"), async (req, res) => {
    try {
      const file = req.file;
      const { documentType } = req.body;
      
      if (!file) return res.status(400).json({ message: "No document uploaded" });
      if (!documentType || !['police_check', 'wwcc'].includes(documentType)) {
        return res.status(400).json({ message: "Invalid document type" });
      }

      const userId = req.session.userId;
      const user = await storage.getUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const ext = path.extname(file.originalname);
      const newPath = path.join("uploads", `${file.filename}${ext}`);
      fs.renameSync(file.path, newPath);

      const documentUrl = `/uploads/${file.filename}${ext}`;

      // Send admin notification for document submission
      try {
        await sendDocumentSubmissionNotification({
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          email: user.email ?? '',
          documentType: documentType as 'police_check' | 'wwcc',
          submissionDate: new Date(),
          documentUrl: `${req.protocol}://${req.get('host')}${documentUrl}`
        });
      } catch (emailError) {
        console.warn("Failed to send document submission notification:", emailError);
      }

      return res.json({ url: documentUrl });
    } catch (error) {
      console.error("Document upload error:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  // Multiple photos upload endpoint
  app.post("/api/upload-profile-photos", requireAuth, upload.array("photos", 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No photos uploaded" });
      }

      const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const uploadedPhotos = [];

      for (const file of files) {
        // Validate file type
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedTypes.includes(ext)) {
          fs.unlinkSync(file.path);
          continue; // Skip invalid files
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          fs.unlinkSync(file.path);
          continue; // Skip large files
        }

        const newFilename = `${randomUUID()}${ext}`;
        const newPath = path.join("uploads", newFilename);
        fs.renameSync(file.path, newPath);

        const photoUrl = `/uploads/${newFilename}`;
        uploadedPhotos.push({
          id: randomUUID(),
          url: photoUrl,
          originalName: file.originalname
        });
      }

      // Store photos in user's profile
      const userId = req.session.userId;
      await storage.addUserPhotos(userId, uploadedPhotos);

      return res.json({ 
        photos: uploadedPhotos, 
        message: `${uploadedPhotos.length} photo(s) uploaded successfully`,
        skipped: files.length - uploadedPhotos.length
      });
    } catch (error) {
      console.error("Photos upload error:", error);
      res.status(500).json({ message: "Failed to upload photos" });
    }
  });

  // Single photo upload endpoint (for backward compatibility)
  app.post("/api/upload-profile-photo", requireAuth, upload.single("photo"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ message: "No photo uploaded" });

      const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedTypes.includes(ext)) {
        fs.unlinkSync(file.path);
        return res.status(400).json({ message: "Invalid file type. Only JPG, PNG, GIF, and WebP files are allowed." });
      }

      if (file.size > 5 * 1024 * 1024) {
        fs.unlinkSync(file.path);
        return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
      }

      const newFilename = `${randomUUID()}${ext}`;
      const newPath = path.join("uploads", newFilename);
      fs.renameSync(file.path, newPath);

      const photoUrl = `/uploads/${newFilename}`;

      // If this is the first photo, set as profile image
      const userId = req.session.userId;
      const user = await storage.getUserById(userId);
      if (user && !user.profileImageUrl) {
        await storage.updateUserProfilePhoto(userId, photoUrl);
      }

      // Add to user's photo collection
      await storage.addUserPhotos(userId, [{
        id: randomUUID(),
        url: photoUrl,
        originalName: file.originalname,
        isMain: !user.profileImageUrl // First photo becomes main
      }]);

      return res.json({ url: photoUrl, message: "Photo uploaded successfully" });
    } catch (error) {
      console.error("Photo upload error:", error);
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  // Get user profile photos
  app.get("/api/profile-photos", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const photos = await storage.getUserPhotos(userId);
      return res.json(photos || []);
    } catch (error) {
      console.error("Get profile photos error:", error);
      res.status(500).json({ message: "Failed to get profile photos" });
    }
  });

  // Delete a photo
  app.delete("/api/profile-photos/:photoId", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const photoId = req.params.photoId;
      
      await storage.deleteUserPhoto(userId, photoId);
      
      return res.json({ message: "Photo deleted successfully" });
    } catch (error) {
      console.error("Delete photo error:", error);
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });

  // Set main photo
  app.put("/api/profile-photos/:photoId/main", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const photoId = req.params.photoId;
      
      await storage.setMainPhoto(userId, photoId);
      
      return res.json({ message: "Main photo updated successfully" });
    } catch (error) {
      console.error("Set main photo error:", error);
      res.status(500).json({ message: "Failed to set main photo" });
    }
  });

  // Auth routes
  app.post('/api/register', async (req, res) => {
    try {
      console.log("Registration body:", req.body);

      // Validate request body using the shared insertUserSchema
      const validationResult = insertUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        console.log("Validation failed:", validationResult.error.errors);
        return res.status(400).json({
          message: "Invalid input",
          details: validationResult.error.errors,
        });
      }

      const userData = validationResult.data;

      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        // Determine the role being requested
        const requestedRole = userData.isNanny ? "caregiver" : "parent";
        
        // Check if user already has this role
        const existingRoles = existingUser.roles || ["parent"];
        const hasRole = existingRoles.includes(requestedRole);
        
        if (hasRole) {
          // User already has this role, just log them in
          req.session.userId = existingUser.id;
          req.session.activeRole = requestedRole;
          
          await new Promise<void>((resolve, reject) => {
            req.session.save((err) => {
              if (err) reject(err);
              else resolve();
            });
          });
          
          return res.json({
            message: `Welcome back! You already have a ${requestedRole} account.`,
            id: existingUser.id,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            roles: existingRoles,
            activeRole: requestedRole,
            isNanny: existingUser.isNanny
          });
        }
        
        // Add new role to existing user
        const updatedRoles = existingRoles.includes(requestedRole) 
          ? existingRoles 
          : [...existingRoles, requestedRole];
        const updatedUser = await storage.updateUserRoles(existingUser.id, updatedRoles);
        
        // Send admin notification for role addition
        if (!existingRoles.includes(requestedRole)) {
          try {
            const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'info@tornevelk.com';
            await sendEmail(
              adminEmail,
              `User Added ${requestedRole} Role on VIVALY`,
              `<h3>Existing User Added New Role</h3>
              <p><strong>Name:</strong> ${existingUser.firstName} ${existingUser.lastName}</p>
              <p><strong>Email:</strong> ${existingUser.email}</p>
              <p><strong>Added Role:</strong> ${requestedRole}</p>
              <p><strong>Previous Roles:</strong> ${existingRoles.join(', ')}</p>
              <p><strong>Current Roles:</strong> ${updatedRoles.join(', ')}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}</p>
              <p><strong>User ID:</strong> ${existingUser.id}</p>
              <hr>
              <p><small>Login to VIVALY admin to manage this user</small></p>`
            );
          } catch (emailError) {
            console.warn("Failed to send admin role addition notification:", emailError);
          }
        }
        
        // Set session for the user
        req.session.userId = existingUser.id;
        req.session.activeRole = requestedRole;
        
        // Ensure session persistence
        await new Promise<void>((resolve, reject) => {
          req.session.save((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
        return res.json({
          message: `Added ${requestedRole} role to your account.`,
          id: existingUser.id,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          roles: updatedRoles,
          activeRole: requestedRole,
          isNanny: existingUser.isNanny || requestedRole === "caregiver"
        });
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Determine user roles based on isNanny flag
      const userRoles = userData.isNanny ? ["caregiver"] : ["parent"];
      
      const cleanUserData = {
        email: userData.email.toLowerCase().trim(),
        password: hashedPassword,
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        phone: userData.phone,
        isNanny: userData.isNanny || false,
        roles: userRoles,
        allowCaregiverMessages: true,
      };

      const user = await storage.createUser(cleanUserData);

      req.session.userId = user.id;
      req.session.activeRole = userRoles[0]; // Set default active role

      // Send owner notification for new user signup
      try {
        const roleType = userData.isNanny ? 'Caregiver' : 'Parent';
        await notifyOwner(
          `🆕 New ${roleType} Signup: ${user.firstName} ${user.lastName}`,
          `<div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h3>New ${roleType} Registration</h3>
            <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
            <p><strong>Role:</strong> ${roleType}</p>
            <p><strong>Suburb:</strong> ${user.suburb || 'Not provided'}</p>
            <p><strong>Registration Time:</strong> ${new Date().toLocaleString('en-AU', { 
              timeZone: 'Australia/Sydney',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>`
        );
      } catch (emailError) {
        console.warn("Failed to send owner notification:", emailError);
      }

      // Ensure session persistence
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: userRoles,
        activeRole: userRoles[0],
        isNanny: user.isNanny,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Account creation failed. Please try again." });
    }
  });

  app.post('/api/reset-password', async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const user = await storage.getUserByEmail(normalizedEmail);

      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ message: "If an account exists, a reset email will be sent" });
      }

      // Generate reset token and expiry
      const resetToken = randomUUID();
      const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Store reset token (in a real app, you'd store this in the database)
      // For now, we'll just send the email
      
      try {
        await sendEmail(
          normalizedEmail,
          'Reset Your VIVALY Password',
          `
          <h2>Reset Your Password</h2>
          <p>Hi ${user.firstName},</p>
          <p>You requested to reset your password for your VIVALY account.</p>
          <p>Click the link below to reset your password:</p>
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}" 
             style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
             Reset Password
          </a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, you can safely ignore this email.</p>
          <p>Best regards,<br>The VIVALY Team</p>
          `
        );
      } catch (emailError) {
        console.warn("Failed to send password reset email:", emailError);
      }

      res.json({ message: "If an account exists, a reset email will be sent" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const { email, password, role } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, password, and role are required" });
      }

      // Normalize email input
      const normalizedEmail = email.toLowerCase().trim();

      // Find user by email
      const user = await storage.getUserByEmail(normalizedEmail);
      if (!user || !user.password) {
        // Add small delay to slow brute-force attacks
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        // Add small delay to slow brute-force attacks
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Get user roles (default to parent if no roles set)
      const userRoles = user.roles || ["parent"];
      
      // Check if user has the requested role
      if (!userRoles.includes(role)) {
        return res.status(403).json({ message: `User does not have role: ${role}` });
      }

      // Store user ID and active role in session
      req.session.userId = user.id;
      req.session.activeRole = role;

      // Ensure session persistence
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Audit log successful login
      console.info(`User ${user.id} (${user.email}) logged in with role: ${role}`);

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: userRoles,
        activeRole: role,
        isNanny: user.isNanny
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout error" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user endpoint
  app.get('/api/auth/user', requireAuth, async (req, res) => {
    try {
      // `requireAuth` has already loaded the user onto req.user
      const user = (req as any).user;
      const activeRole = req.session.activeRole || user.roles?.[0] || 'parent';
      
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles || ['parent'],
        activeRole: activeRole,
        isNanny: user.isNanny || false,
      });
    } catch (err) {
      console.error('Error in /api/auth/user:', err);
      res.status(500).json({ message: 'Could not fetch user' });
    }
  });

  // Role switching route
  app.post('/api/auth/switch-role', async (req, res) => {
    try {
      const { role } = req.body;
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      if (!role) {
        return res.status(400).json({ message: "Role is required" });
      }

      // Get user to verify role access
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const userRoles = user.roles || ["parent"];
      
      // Check if user has requested role
      if (!userRoles.includes(role)) {
        return res.status(403).json({ message: `User does not have role: ${role}` });
      }

      // Update active role in session
      req.session.activeRole = role;

      // Ensure session persistence
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Audit log successful role switch
      console.info(`User ${userId} (${user.email}) switched to role: ${role}`);

      const response = { 
        activeRole: role,
        roles: userRoles 
      };
      
      res.json(response);
    } catch (error) {
      console.error("Switch role error:", error);
      res.status(500).json({ message: "Failed to switch role" });
    }
  });

  // Password reset request with Resend
  app.post('/api/reset-password', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });

      const normalizedEmail = email.toLowerCase().trim();
      const user = await storage.getUserByEmail(normalizedEmail);
      
      // Always return success to prevent email enumeration attacks
      if (!user) {
        return res.json({ message: "If an account exists, a reset email will be sent" });
      }

      // Generate reset token
      const resetToken = randomUUID();
      const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token in database
      await storage.updateUserResetToken(user.id, resetToken, resetTokenExpires);

      // Create reset link - use current domain
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://vivaly.com.au' : `${req.protocol}://${req.get('host')}`;
      const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

      try {
        await sendEmail(
          normalizedEmail,
          'Reset your VIVALY password',
          `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #000;">Reset your VIVALY password</h2>
            <p>Hi ${user.firstName},</p>
            <p>You requested to reset your password for your VIVALY account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="${resetLink}" style="color: #000; text-decoration: underline;">${resetLink}</a></p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>Best regards,<br>The VIVALY Team</p>
          </div>`
        );
        
        console.log(`Password reset email sent to: ${normalizedEmail}`);
        res.json({ message: "If an account exists, a reset email will be sent" });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't reveal email sending failure to prevent enumeration
        res.json({ message: "If an account exists, a reset email will be sent" });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to process reset request" });
    }
  });

  // Password reset confirmation
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      const user = await storage.getUserByResetToken(token);
      
      if (!user || !user.resetTokenExpires || new Date() > user.resetTokenExpires) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password and clear reset token
      await storage.updateUserPassword(user.id, hashedPassword);
      await storage.clearUserResetToken(user.id);

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Get single job by ID (public endpoint for job details)
  app.get('/api/jobs/:jobId', async (req, res) => {
    try {
      const { jobId } = req.params;
      
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Get parent profile for the job
      const parentProfile = await storage.getUser(job.parentId);
      
      res.json({
        ...job,
        parentProfile: parentProfile ? {
          firstName: parentProfile.firstName,
          lastName: parentProfile.lastName,
          profilePhoto: parentProfile.profileImageUrl,
          suburb: null
        } : null
      });
    } catch (error) {
      console.error("Get job error:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  // Messages routes
  app.get('/api/messages', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const messages = await storage.getMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.post('/api/messages', requireAuth, async (req, res) => {
    try {
      const { receiverId, content } = req.body;
      const senderId = req.session.userId;

      if (!receiverId || !content) {
        return res.status(400).json({ message: "Receiver ID and content required" });
      }

      const message = await storage.createMessage({
        senderId,
        receiverId,
        content
      });

      // Notify owner of new message
      try {
        const sender = await storage.getUserById(senderId ?? '');
        const receiver = await storage.getUserById(receiverId);
        await notifyOwner(
          `💬 New Message: ${sender?.firstName} → ${receiver?.firstName}`,
          `<div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h3>New Platform Message</h3>
            <p><strong>From:</strong> ${sender?.firstName} ${sender?.lastName} (${sender?.email})</p>
            <p><strong>To:</strong> ${receiver?.firstName} ${receiver?.lastName} (${receiver?.email})</p>
            <p><strong>Sent:</strong> ${new Date().toLocaleString('en-AU', { 
              timeZone: 'Australia/Sydney',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <hr>
            <p><strong>Message Preview:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; font-style: italic;">
              "${content.substring(0, 150)}${content.length > 150 ? '...' : ''}"
            </div>
          </div>`
        );
      } catch (emailError) {
        console.warn("Failed to send owner notification:", emailError);
      }

      res.json(message);
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Users routes
  app.get('/api/users', requireAuth, async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isNanny: user.isNanny
      })));
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  // Job posting routes (parent-only)
  app.post('/api/postJob', requireRole('parent'), async (req, res) => {
    try {
      const { title, startDate, numChildren, rate, hoursPerWeek, description, location, suburb } = req.body;
      const parentId = req.session.userId;

      if (!title || !startDate || !numChildren || !rate || !hoursPerWeek || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const jobId = randomUUID();
      
      const job = await storage.createJob({
        id: jobId,
        parentId,
        title,
        startDate,
        numChildren: parseInt(numChildren),
        rate: rate,
        hoursPerWeek: parseInt(hoursPerWeek),
        description,
        location: location || null,
        suburb: suburb || null
      });

      // Notify owner of new job posting
      try {
        const parent = await storage.getUserById(parentId ?? '');
        await notifyOwner(
          `📢 New Job Posted: ${title}`,
          `<div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h3>New Job Posting</h3>
            <p><strong>Job ID:</strong> ${jobId}</p>
            <p><strong>Parent:</strong> ${parent?.firstName || ''} ${parent?.lastName || ''}</p>
            <p><strong>Email:</strong> ${parent?.email || ''}</p>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Rate:</strong> $${rate}/hr</p>
            <p><strong>Hours/Week:</strong> ${hoursPerWeek}</p>
            <p><strong>Children:</strong> ${numChildren}</p>
            <p><strong>Location:</strong> ${location || suburb || 'Not specified'}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Posted:</strong> ${new Date().toLocaleString('en-AU', { 
              timeZone: 'Australia/Sydney',
              year: 'numeric',
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>`
        );
      } catch (emailError) {
        console.warn("Failed to send owner notification:", emailError);
      }

      res.json({ success: true, message: "Job posted!", job });
    } catch (error) {
      console.error("Post job error:", error);
      res.status(500).json({ success: false, message: "Failed to post job" });
    }
  });

  // RESTful job creation endpoint
  app.post('/api/jobs', requireRole('parent'), async (req, res) => {
    try {
      const { title, startDate, numChildren, rate, hoursPerWeek, description, location, suburb } = req.body;
      const parentId = req.session.userId;

      if (!title || !startDate || !numChildren || !rate || !hoursPerWeek || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const jobId = randomUUID();
      
      const job = await storage.createJob({
        id: jobId,
        parentId,
        title,
        startDate,
        numChildren: parseInt(numChildren),
        rate: rate,
        hoursPerWeek: parseInt(hoursPerWeek),
        description,
        location: location || null,
        suburb: suburb || null
      });

      res.json({ success: true, message: "Job posted!", job });
    } catch (error) {
      console.error("Post job error:", error);
      res.status(500).json({ success: false, message: "Failed to post job" });
    }
  });

  // Get all jobs - public endpoint for browsing
  app.get('/api/jobs', async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ message: "Failed to get jobs" });
    }
  });

  app.get('/api/jobs/my', requireAuth, async (req, res) => {
    try {
      const parentId = req.session.userId;
      const jobs = await storage.getJobsByParent(parentId);
      res.json(jobs);
    } catch (error) {
      console.error("Get my jobs error:", error);
      res.status(500).json({ message: "Failed to get jobs" });
    }
  });

  // Update parent profile
  app.put('/api/parent/profile', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const profileData = req.body;
      
      // Update user basic info if provided
      if (profileData.homeAddress || profileData.suburb || profileData.bio) {
        await storage.updateUser(userId, {
          homeAddress: profileData.homeAddress,
          suburb: profileData.suburb,
          bio: profileData.bio
        });
      }
      
      // Create or update parent profile
      await storage.upsertParentProfile({
        userId,
        ...profileData
      });

      res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
      console.error("Update parent profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Save caregiver section data
  app.post('/api/caregiver/save-section', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { section, data } = req.body;
      
      // Update user data based on section
      const updateData: any = {};
      
      if (section === 'personal') {
        updateData.firstName = data.firstName;
        updateData.lastName = data.lastName;
        updateData.email = data.email;
        updateData.phone = data.phone;
      } else if (section === 'experience') {
        updateData.bio = data.bio;
        updateData.experience = data.experience;
        updateData.ageGroups = JSON.stringify(data.ageGroups);
      } else if (section === 'services') {
        updateData.services = JSON.stringify(data.services);
        updateData.hourlyRate = data.hourlyRate;
        updateData.location = data.location;
      }
      
      await storage.updateUser(userId, updateData);
      
      res.json({ success: true, message: "Section saved successfully" });
    } catch (error) {
      console.error("Save caregiver section error:", error);
      res.status(500).json({ message: "Failed to save section" });
    }
  });

  app.post('/api/jobs/:jobId/apply', requireRole('caregiver'), async (req, res) => {
    try {
      const { jobId } = req.params;
      const caregiverId = req.session.userId;

      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Get caregiver's profile information
      const caregiver = await storage.getUserById(caregiverId);
      const caregiverProfile = await storage.getCaregiverProfile(caregiverId);

      // Create the application
      const application = await storage.createApplication({
        jobId,
        caregiverId,
        caregiverProfile: null
      });

      // Automatically send a message to the parent with caregiver's profile (contact info filtered)
      const profileMessage = `Hi! I'm interested in your childcare position "${job.title}". Here's my profile:

👋 About Me: ${caregiver.firstName} ${caregiver.lastName}
📍 Location: ${caregiverProfile?.suburb || 'Sydney, NSW'}
💰 Rate: $${caregiverProfile?.hourlyRate || '35'}/hour
⭐ Rating: ${caregiverProfile?.rating || 'New'} (${caregiverProfile?.reviewCount || 0} reviews)
${caregiverProfile?.isVerified ? '✅ Verified profile' : ''}
${caregiverProfile?.hasPoliceCheck ? '🛡️ Police check completed' : ''}

📝 Experience: ${caregiverProfile?.experience || 'Passionate about childcare'}

${caregiverProfile?.bio || 'Looking forward to caring for your family!'}

I'd love to discuss this opportunity further through the platform messaging system. Contact details will be shared once a booking is confirmed and paid for security.`;

      // Send the automated message
      await storage.sendMessage({
        senderId: caregiverId,
        receiverId: job.parentId,
        content: profileMessage,
        timestamp: new Date()
      });

      // Notify owner of new job application
      try {
        const parent = await storage.getUserById(job.parentId);
        await notifyOwner(
          `✉️ New Application: ${caregiver?.firstName} applied to ${job.title}`,
          `<div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h3>New Job Application</h3>
            <p><strong>Application ID:</strong> ${application.id}</p>
            <p><strong>Job:</strong> ${job.title}</p>
            <p><strong>Parent:</strong> ${parent?.firstName} ${parent?.lastName}</p>
            <p><strong>Parent Email:</strong> ${parent?.email}</p>
            <p><strong>Caregiver:</strong> ${caregiver?.firstName} ${caregiver?.lastName}</p>
            <p><strong>Caregiver Email:</strong> ${caregiver?.email}</p>
            <p><strong>Rate:</strong> $${caregiverProfile?.hourlyRate || 'Not specified'}/hr</p>
            <p><strong>Location:</strong> ${caregiverProfile?.suburb || 'Not specified'}</p>
            <p><strong>Applied:</strong> ${new Date().toLocaleString('en-AU', { 
              timeZone: 'Australia/Sydney',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <hr>
            <p><strong>Automated message sent to parent:</strong></p>
            <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 14px;">
              ${profileMessage.substring(0, 200)}...
            </div>
          </div>`
        );
      } catch (emailError) {
        console.warn("Failed to send owner notification:", emailError);
      }

      res.json({ message: "Profile sent to family!", application });
    } catch (error) {
      console.error("Apply to job error:", error);
      res.status(500).json({ message: "Failed to contact family" });
    }
  });



  // Update job endpoint
  app.put('/api/jobs/:jobId', requireAuth, async (req, res) => {
    try {
      const { jobId } = req.params;
      const userId = req.session.userId;
      const { title, startDate, numChildren, rate, hoursPerWeek, description, location, suburb } = req.body;

      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Only allow parent who posted the job to update it
      if (job.parentId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this job" });
      }

      if (!title || !startDate || !numChildren || !rate || !hoursPerWeek || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const updatedJob = await storage.updateJob(jobId, {
        title,
        startDate,
        numChildren,
        rate,
        hoursPerWeek,
        description,
        location: location || null,
        suburb: suburb || null
      });

      res.json(updatedJob);
    } catch (error) {
      console.error("Update job error:", error);
      res.status(500).json({ message: "Failed to update job" });
    }
  });



  // Delete job endpoint
  app.delete('/api/jobs/:jobId', requireAuth, async (req, res) => {
    try {
      const { jobId } = req.params;
      const userId = req.session.userId;

      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Only allow parent who posted the job to delete it
      if (job.parentId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this job" });
      }

      await storage.deleteJob(jobId);
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      console.error("Delete job error:", error);
      res.status(500).json({ message: "Failed to delete job" });
    }
  });

  app.get('/api/jobs/:jobId/applications', requireAuth, async (req, res) => {
    try {
      const { jobId } = req.params;
      const applications = await storage.getApplicationsByJob(jobId);
      res.json(applications);
    } catch (error) {
      console.error("Get job applications error:", error);
      res.status(500).json({ message: "Failed to get applications" });
    }
  });

  app.get('/api/applications/my', requireAuth, async (req, res) => {
    try {
      const caregiverId = req.session.userId;
      const applications = await storage.getApplicationsByCaregiver(caregiverId);
      res.json(applications);
    } catch (error) {
      console.error("Get my applications error:", error);
      res.status(500).json({ message: "Failed to get applications" });
    }
  });

  // Send interest/apply for job
  app.post('/api/send-interest', requireAuth, async (req, res) => {
    try {
      const { jobId, parentId, message } = req.body;
      const caregiverId = req.session.userId;

      if (!jobId || !parentId || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Create job application
      const applicationId = nanoid();
      await storage.createApplication({
        id: applicationId,
        caregiverId,
        jobId,
        message,
        status: 'pending',
        appliedAt: new Date().toISOString()
      });

      // Create automated message to parent with application
      const caregiver = await storage.getUser(caregiverId);
      if (caregiver) {
        const messageId = nanoid();
        await storage.createMessage({
          id: messageId,
          senderId: caregiverId,
          receiverId: parentId,
          content: message,
          createdAt: new Date().toISOString()
        });
      }

      // Send email notification to owner
      await sendOwnerNotification({
        type: 'job_application',
        details: {
          caregiverId,
          jobId,
          parentId,
          message: message.substring(0, 100) + '...'
        }
      });

      res.json({ success: true, applicationId });
    } catch (error) {
      console.error('Error sending interest:', error);
      res.status(500).json({ message: 'Failed to send interest' });
    }
  });

  // Save caregiver profile section
  app.post('/api/caregiver-profile/section/:section', requireAuth, async (req, res) => {
    try {
      const { section } = req.params;
      const data = req.body;
      const userId = req.session.userId;

      // Update specific section of caregiver profile
      await storage.updateCaregiverProfileSection(userId, section, data);

      // Send email notification to owner
      await sendOwnerNotification({
        type: 'profile_section_update',
        details: {
          userId,
          section,
          userEmail: data.email || 'Not provided'
        }
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Error saving profile section:', error);
      res.status(500).json({ message: 'Failed to save profile section' });
    }
  });

  // Additional job board routes
  app.get('/api/getJobs', async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ message: "Failed to get jobs" });
    }
  });

  app.post('/api/applyToJob', requireAuth, async (req, res) => {
    try {
      const caregiverId = req.session.userId;
      const { jobId } = req.body;

      if (!jobId) {
        return res.status(400).json({ message: "Job ID is required" });
      }

      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      const caregiver = await storage.getUser(caregiverId);
      if (!caregiver) {
        return res.status(404).json({ message: "Caregiver not found" });
      }

      // Create application
      const application = await storage.createApplication({
        jobId,
        caregiverId,
        caregiverProfile: null
      });

      // Create automated message to parent with caregiver profile
      const profileMessage = `Hi, I'm interested in your job post titled "${job.title || 'Childcare Position'}".

Here's my profile:
👋 ${caregiver.firstName} ${caregiver.lastName}
📧 ${caregiver.email}
📱 ${caregiver.phone || 'Phone not provided'}

I'd love to discuss this opportunity with you. Please feel free to reach out!`;

      const message = await storage.createMessage({
        content: profileMessage,
        senderId: caregiverId,
        receiverId: job.parentId
      });

      res.json({ success: true, message: "Application sent!", application });
    } catch (error) {
      console.error("Apply to job error:", error);
      res.status(500).json({ message: "Failed to apply to job" });
    }
  });

  // Get caregiver bookings with enhanced data
  app.get('/api/caregiver/bookings', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const bookings = await storage.getUserBookings(userId);
      
      // Enhance bookings with job and parent details
      const enhancedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const job = await storage.getJob(booking.jobId);
          const parent = await storage.getUser(booking.parentId);
          
          return {
            ...booking,
            job: job ? {
              title: job.title,
              location: job.location,
              description: job.description,
              childrenAges: job.childrenAges || []
            } : null,
            parent: parent ? {
              firstName: parent.firstName,
              lastName: parent.lastName,
              phone: parent.phone,
              email: parent.email
            } : null
          };
        })
      );

      res.json(enhancedBookings);
    } catch (error) {
      console.error("Get caregiver bookings error:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Update booking status
  app.patch('/api/bookings/:bookingId/status', requireAuth, async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      if (!status || !['confirmed', 'cancelled', 'completed'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const booking = await storage.updateBookingStatus(bookingId, status);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Notify owner of booking status change
      try {
        const parent = await storage.getUserById(booking.parentId);
        const caregiver = await storage.getUserById(booking.caregiverId);
        const job = await storage.getJob(booking.jobId);
        
        await notifyOwner(
          `📅 Booking ${status.toUpperCase()}: ${parent?.firstName} & ${caregiver?.firstName}`,
          `<div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h3>Booking Status Update</h3>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>New Status:</strong> ${status.toUpperCase()}</p>
            <p><strong>Job:</strong> ${job?.title || 'Unknown'}</p>
            <p><strong>Parent:</strong> ${parent?.firstName} ${parent?.lastName} (${parent?.email})</p>
            <p><strong>Caregiver:</strong> ${caregiver?.firstName} ${caregiver?.lastName} (${caregiver?.email})</p>
            <p><strong>Updated:</strong> ${new Date().toLocaleString('en-AU', { 
              timeZone: 'Australia/Sydney',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            ${status === 'confirmed' ? '<p style="color: green;"><strong>Revenue Opportunity:</strong> Confirmed booking may generate commission revenue.</p>' : ''}
          </div>`
        );
      } catch (emailError) {
        console.warn("Failed to send owner notification:", emailError);
      }

      res.json(booking);
    } catch (error) {
      console.error("Update booking status error:", error);
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Create new booking
  app.post("/api/bookings", requireAuth, async (req, res) => {
    try {
      const { jobId, caregiverId, parentId, startDate, endDate, totalAmount } = req.body;
      const userId = req.session.userId;

      if (!jobId || !caregiverId || !parentId) {
        return res.status(400).json({ message: "Job ID, caregiver ID, and parent ID are required" });
      }

      // Create booking
      const booking = await storage.createBooking({
        id: randomUUID(),
        jobId,
        caregiverId,
        parentId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalAmount: totalAmount || 0,
        status: 'pending',
        createdAt: new Date()
      });

      // Notify owner of new booking
      try {
        const parent = await storage.getUserById(parentId);
        const caregiver = await storage.getUserById(caregiverId);
        const job = await storage.getJob(jobId);
        
        await notifyOwner(
          `✅ New Booking Created: ${parent?.firstName} & ${caregiver?.firstName}`,
          `<div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h3>New Booking Created</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Job:</strong> ${job?.title || 'Unknown'}</p>
            <p><strong>Parent:</strong> ${parent?.firstName} ${parent?.lastName} (${parent?.email})</p>
            <p><strong>Caregiver:</strong> ${caregiver?.firstName} ${caregiver?.lastName} (${caregiver?.email})</p>
            <p><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString('en-AU')}</p>
            <p><strong>End Date:</strong> ${new Date(endDate).toLocaleDateString('en-AU')}</p>
            <p><strong>Total Amount:</strong> $${totalAmount || 'TBD'}</p>
            <p><strong>Status:</strong> PENDING</p>
            <p><strong>Created:</strong> ${new Date().toLocaleString('en-AU', { 
              timeZone: 'Australia/Sydney',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p style="color: orange;"><strong>Revenue Opportunity:</strong> New booking created - potential commission revenue.</p>
          </div>`
        );
      } catch (emailError) {
        console.warn("Failed to send owner notification:", emailError);
      }

      res.json(booking);
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Simple email test endpoint
  app.post("/api/test-email", async (req, res) => {
    try {
      const testEmail = await sendEmail(
        'tornevelk1@gmail.com',
        'VIVALY Test Email - Please Check Your Inbox',
        `<div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Email Delivery Test</h2>
          <p><strong>Test Time:</strong> ${new Date().toLocaleString('en-AU', { 
            timeZone: 'Australia/Sydney',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p>If you receive this email, your notification system is working correctly.</p>
          <p><strong>Next steps:</strong></p>
          <ul>
            <li>Check your spam/junk folder if this email isn't in your inbox</li>
            <li>Add tornevelk1@gmail.com to your safe senders list</li>
            <li>Mark this email as "Not Spam" if it's in junk</li>
          </ul>
          <p>This confirms SendGrid is delivering emails to your address.</p>
        </div>`
      );
      
      res.json({ 
        success: true, 
        message: "Test email sent! Check your inbox and spam folder at tornevelk1@gmail.com",
        details: testEmail
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to send test email",
        error: error.message
      });
    }
  });

  // Send comprehensive trial notifications to show all alert types
  app.post("/api/send-trial-notifications", async (req, res) => {
    try {
      const currentTime = new Date().toLocaleString('en-AU', { 
        timeZone: 'Australia/Sydney',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Send multiple trial notifications showing each type
      const notifications = [
        {
          subject: "🆕 New Parent Signup: Sarah Johnson",
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h3>New Parent Registration</h3>
            <p><strong>Name:</strong> Sarah Johnson</p>
            <p><strong>Email:</strong> sarah.j@example.com</p>
            <p><strong>Phone:</strong> 0412 345 678</p>
            <p><strong>Role:</strong> Parent</p>
            <p><strong>Suburb:</strong> Bondi Junction</p>
            <p><strong>Registration Time:</strong> ${currentTime}</p>
            <hr>
            <p><em>TRIAL EMAIL: This shows what you'll receive when parents register</em></p>
          </div>`
        },
        {
          subject: "🆕 New Caregiver Signup: Emma Wilson",
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h3>New Caregiver Registration</h3>
            <p><strong>Name:</strong> Emma Wilson</p>
            <p><strong>Email:</strong> emma.w@example.com</p>
            <p><strong>Phone:</strong> 0423 456 789</p>
            <p><strong>Role:</strong> Caregiver</p>
            <p><strong>Suburb:</strong> Paddington</p>
            <p><strong>Registration Time:</strong> ${currentTime}</p>
            <hr>
            <p><em>TRIAL EMAIL: This shows what you'll receive when caregivers register</em></p>
          </div>`
        },
        {
          subject: "📢 New Job Posted: After School Care Needed",
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h3>New Job Posting</h3>
            <p><strong>Job ID:</strong> job_trial_123</p>
            <p><strong>Parent:</strong> Sarah Johnson</p>
            <p><strong>Email:</strong> sarah.j@example.com</p>
            <p><strong>Title:</strong> After School Care Needed</p>
            <p><strong>Rate:</strong> $35/hr</p>
            <p><strong>Hours/Week:</strong> 15</p>
            <p><strong>Children:</strong> 2</p>
            <p><strong>Location:</strong> Bondi Junction</p>
            <p><strong>Description:</strong> Looking for reliable after school care for two children aged 6 and 8.</p>
            <p><strong>Posted:</strong> ${currentTime}</p>
            <hr>
            <p><em>TRIAL EMAIL: This shows what you'll receive when jobs are posted</em></p>
          </div>`
        },
        {
          subject: "✉️ New Application: Emma applied to After School Care Needed",
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h3>New Job Application</h3>
            <p><strong>Application ID:</strong> app_trial_456</p>
            <p><strong>Job:</strong> After School Care Needed</p>
            <p><strong>Parent:</strong> Sarah Johnson</p>
            <p><strong>Parent Email:</strong> sarah.j@example.com</p>
            <p><strong>Caregiver:</strong> Emma Wilson</p>
            <p><strong>Caregiver Email:</strong> emma.w@example.com</p>
            <p><strong>Rate:</strong> $35/hr</p>
            <p><strong>Location:</strong> Paddington</p>
            <p><strong>Applied:</strong> ${currentTime}</p>
            <hr>
            <p><strong>Automated message sent to parent:</strong></p>
            <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 14px;">
              Hi! I'm interested in your childcare position "After School Care Needed". Here's my profile: 👋 About Me: Emma Wilson 📍 Location: Paddington...
            </div>
            <hr>
            <p><em>TRIAL EMAIL: This shows what you'll receive when caregivers apply to jobs</em></p>
          </div>`
        },
        {
          subject: "💬 New Message: Emma → Sarah",
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h3>New Platform Message</h3>
            <p><strong>From:</strong> Emma Wilson (emma.w@example.com)</p>
            <p><strong>To:</strong> Sarah Johnson (sarah.j@example.com)</p>
            <p><strong>Sent:</strong> ${currentTime}</p>
            <hr>
            <p><strong>Message Preview:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; font-style: italic;">
              "Hi Sarah! Thank you for considering my application. I'd love to discuss the after school care position. I have 5 years of experience..."
            </div>
            <hr>
            <p><em>TRIAL EMAIL: This shows what you'll receive when users send messages</em></p>
          </div>`
        },
        {
          subject: "📅 Booking CONFIRMED: Sarah & Emma",
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h3>Booking Status Update</h3>
            <p><strong>Booking ID:</strong> booking_trial_789</p>
            <p><strong>New Status:</strong> CONFIRMED</p>
            <p><strong>Job:</strong> After School Care Needed</p>
            <p><strong>Parent:</strong> Sarah Johnson (sarah.j@example.com)</p>
            <p><strong>Caregiver:</strong> Emma Wilson (emma.w@example.com)</p>
            <p><strong>Updated:</strong> ${currentTime}</p>
            <p style="color: green;"><strong>Revenue Opportunity:</strong> Confirmed booking may generate commission revenue.</p>
            <hr>
            <p><em>TRIAL EMAIL: This shows what you'll receive when bookings are confirmed</em></p>
          </div>`
        }
      ];

      // Send all trial notifications
      for (const notification of notifications) {
        await notifyOwner(notification.subject, notification.html);
        // Small delay between emails
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      res.json({ 
        success: true, 
        message: `Trial notifications sent! Check your email at ${process.env.OWNER_EMAIL} - you should receive ${notifications.length} sample emails showing all notification types.`
      });
    } catch (error: any) {
      console.error("Trial notification error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to send trial notifications",
        error: error.message || "Unknown error"
      });
    }
  });

  // Get caregiver's applications
  app.get("/api/applications/my", async (req, res) => {
    try {
      const caregiverId = req.session?.user?.id;
      if (!caregiverId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const applications = await storage.getApplicationsByCaregiver(caregiverId);
      res.json(applications);
    } catch (error) {
      console.error("Get applications error:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get messages between users
  app.get("/api/getMessages", requireAuth, async (req, res) => {
    const userId = req.session.userId;
    const otherUserId = req.query.otherUserId as string;

    if (!otherUserId) {
      return res.status(400).json({ message: "Missing otherUserId" });
    }

    try {
      const messages = await storage.getMessagesBetweenUsers(userId as string, otherUserId);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send message
  app.post("/api/sendMessage", requireAuth, async (req, res) => {
    const senderId = req.session.userId;
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Missing receiverId or text" });
    }

    try {
      const message = await storage.sendMessage({
        senderId: senderId as string,
        receiverId,
        text,
        timestamp: new Date()
      });
      res.json({ success: true, message });
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Get conversations list
  app.get("/api/conversations", requireAuth, async (req, res) => {
    const userId = req.session.userId;

    try {
      const conversations = await storage.getConversations(userId as string);
      res.json(conversations);
    } catch (error) {
      console.error("Get conversations error:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Parent's bookings
  app.get("/api/parent/bookings", requireAuth, async (req, res) => {
    const parentId = req.session.userId;
    try {
      const bookings = await storage.getParentBookings(parentId as string);
      res.json(bookings);
    } catch (error) {
      console.error("Get parent bookings error:", error);
      res.status(500).json({ message: "Failed to fetch parent bookings" });
    }
  });

  // Caregiver's bookings
  app.get("/api/caregiver/bookings", requireAuth, async (req, res) => {
    const caregiverId = req.session.userId;
    try {
      const bookings = await storage.getCaregiverBookings(caregiverId as string);
      res.json(bookings);
    } catch (error) {
      console.error("Get caregiver bookings error:", error);
      res.status(500).json({ message: "Failed to fetch caregiver bookings" });
    }
  });

  // Help email route
  app.post("/api/help/send-email", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Send email to owner
      await sendEmail({
        to: process.env.OWNER_EMAIL!,
        subject: `VIVALY Help Request: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Help Request from VIVALY</h2>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #FF6B35;">Contact Information</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-left: 4px solid #FF6B35;">
              <h3 style="margin-top: 0; color: #333;">Message</h3>
              <p style="line-height: 1.6; color: #666;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #f0f8ff; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                This message was sent through the VIVALY help system. Please respond directly to ${email}.
              </p>
            </div>
          </div>
        `
      });

      res.json({ message: "Help request sent successfully" });
    } catch (error) {
      console.error("Help email error:", error);
      res.status(500).json({ message: "Failed to send help request" });
    }
  });

  // Test all email notifications endpoint
  app.post("/api/test-notifications", async (req, res) => {
    try {
      const result = await sendTestEmails();
      res.json(result);
    } catch (error: any) {
      console.error("Test notifications failed:", error);
      console.error("SendGrid API key status:", process.env.SENDGRID_API_KEY ? "Present" : "Missing");
      
      // Log detailed SendGrid error
      if (error.response?.body) {
        console.error("SendGrid error body:", JSON.stringify(error.response.body, null, 2));
      }
      
      res.status(500).json({ 
        message: "Failed to send test notifications", 
        error: error.message,
        details: error.response?.body || "No additional details"
      });
    }
  });

  // Simple test endpoint to verify SendGrid configuration
  app.post("/api/test-sendgrid", async (req, res) => {
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const msg = {
        to: 'tornevelk1@gmail.com',
        from: 'tornevelk1@gmail.com',
        subject: 'SendGrid Test',
        text: 'This is a test email to verify SendGrid configuration.',
        html: '<p>This is a test email to verify SendGrid configuration.</p>',
      };

      await sgMail.send(msg);
      res.json({ message: "SendGrid test email sent successfully" });
    } catch (error: any) {
      console.error("SendGrid test failed:", error);
      console.error("Error details:", error.response?.body);
      
      res.status(500).json({ 
        message: "SendGrid test failed", 
        error: error.message,
        details: error.response?.body || "No additional details"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}