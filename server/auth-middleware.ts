import { type Request, Response, NextFunction } from "express";
import { storage } from "./storage";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session?.userId;
  
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    // Add user to request object for use in routes
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Authentication error" });
  }
};

export const requireRole = (allowedRoles: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session?.userId;
    const activeRole = req.session?.activeRole;
    
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!activeRole) {
      return res.status(403).json({ message: "No active role set" });
    }

    try {
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const userRoles = user.roles || ["parent"];
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      // Check if user has any of the allowed roles
      if (!rolesArray.some(role => userRoles.includes(role))) {
        return res.status(403).json({ message: `Access denied. Required role: ${rolesArray.join(' or ')}` });
      }

      // Check if current active role is one of the allowed roles
      if (!rolesArray.includes(activeRole)) {
        return res.status(403).json({ message: `Current role '${activeRole}' not authorized for this action` });
      }

      // Add user to request object for use in routes
      (req as any).user = user;
      next();
    } catch (error) {
      console.error("Role authorization error:", error);
      return res.status(500).json({ message: "Authorization error" });
    }
  };
};