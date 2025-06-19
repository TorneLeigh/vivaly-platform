# VIVALY Platform - Current State Export
*Generated: June 19, 2025*

## Platform Overview
VIVALY is a specialized digital platform connecting Australian parents and childcare professionals through an intelligent, adaptive job matching ecosystem. The application provides a comprehensive, user-friendly interface for seamless job discovery, application, and communication with enhanced privacy and role-based access controls.

## Recent Updates Completed
1. **Profile Completion Fix**: Now correctly shows 0% when no optional fields are filled
2. **Role-Based Job Access**: Caregivers can only browse/apply to jobs, cannot post jobs
3. **Enhanced Parent Profile Images**: Increased from 16x16 to 20x20 pixels on job board
4. **Parent Bookings Page**: Shows payment information instead of earnings for parents
5. **Color Theme Implementation**: Added coral-pink (#FF5F7E) and warm orange (#FFA24D)
6. **Police Clearance Badge**: Added badge display for caregivers with National Police Clearance

## Key Technology Stack
- **Frontend**: React.js with TypeScript, Tailwind CSS
- **Backend**: Express.js with Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with role management
- **State Management**: TanStack Query for server state
- **UI Components**: Shadcn/ui component library

## Current Database Schema (Key Tables)

### Users Table
```sql
users: {
  id: varchar (primary key)
  email: varchar (unique)
  firstName: varchar
  lastName: varchar
  profileImageUrl: varchar
  phone: text
  password: text
  roles: json (string[]) default ["parent"]
  isNanny: boolean default false
  allowCaregiverMessages: boolean default false
  resetToken: varchar
  resetTokenExpires: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Nannies/Caregivers Table
```sql
nannies: {
  id: serial (primary key)
  userId: integer (foreign key)
  bio: text
  experience: integer (years)
  hourlyRate: decimal
  location: text
  suburb: text
  introVideo: text (URL)
  profilePhoto: text (URL)
  yearsOfExperience: integer default 0
  reviewCount: integer default 0
  averageRating: decimal default 0.00
  hasPhotoId: boolean default false
  hasWwcc: boolean default false
  hasPoliceCheck: boolean default false  // Used for police clearance badge
  hasFirstAid: boolean default false
  hasReferences: boolean default false
  verificationStatus: text default "pending"
  certificates: json (string[])
  services: json (string[])
  availability: json
  isVerified: boolean default false
  rating: decimal default 0
}
```

### Jobs Table
```sql
jobs: {
  id: varchar (primary key)
  parentId: varchar (foreign key)
  title: varchar
  startDate: varchar
  numChildren: integer
  rate: varchar
  hoursPerWeek: integer
  description: text
  location: varchar
  suburb: varchar
  status: varchar default "active"
  createdAt: timestamp
}
```

### Applications Table
```sql
applications: {
  id: serial (primary key)
  jobId: varchar (foreign key)
  caregiverId: varchar (foreign key)
  status: varchar default "pending"
  appliedAt: timestamp
  message: text
}
```

## Key Components & Features

### 1. Authentication & Role Management
```typescript
// client/src/hooks/useAuth.tsx
// Manages user authentication state and role switching
// Supports both parent and caregiver roles
```

### 2. Profile Completion Calculation
```typescript
// client/src/utils/profileCompletion.ts
export function calculateProfileCompletion(user: any): number {
  if (!user) return 0;
  
  const hasPhone = user.phone && typeof user.phone === 'string' && user.phone.trim().length > 0;
  const hasProfileImage = user.profileImageUrl && typeof user.profileImageUrl === 'string' && user.profileImageUrl.trim().length > 0;
  
  let completedFields = 0;
  if (hasPhone) completedFields++;
  if (hasProfileImage) completedFields++;
  
  const totalOptionalFields = 2;
  if (completedFields === 0) return 0;
  
  return Math.round((completedFields / totalOptionalFields) * 100);
}
```

### 3. Role-Based Job Board Access
```typescript
// client/src/pages/job-board.tsx
// Caregivers: Can only browse and apply to jobs
// Parents: Can browse, post, edit, and delete jobs
const isCaregiver = user?.isNanny || false;
const isParent = user && !user.isNanny;
```

### 4. Police Clearance Badge Implementation
```typescript
// Added to nanny profiles and caregiver cards
{nanny.hasPoliceCheck && (
  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
    <Shield className="w-3 h-3 mr-1" />
    Police Clearance
  </Badge>
)}
```

### 5. Color Theme Variables
```css
/* client/src/index.css */
:root {
  --coral-pink: 344 100% 69%; /* #FF5F7E */
  --warm-orange: 29 100% 64%; /* #FFA24D */
}
```

## Current File Structure
```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/ (Shadcn components)
│   │   │   ├── layout/
│   │   │   └── nanny-card.tsx (includes police badge)
│   │   ├── pages/
│   │   │   ├── caregiver-dashboard.tsx (warm orange theme)
│   │   │   ├── caregiver-bookings.tsx (caregiver view)
│   │   │   ├── parent-bookings.tsx (parent view, no total paid)
│   │   │   ├── job-board.tsx (role-based access)
│   │   │   ├── nanny-profile.tsx (includes police badge)
│   │   │   └── caregiver-profile.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.tsx
│   │   ├── utils/
│   │   │   └── profileCompletion.ts
│   │   └── lib/
├── server/
│   ├── routes.ts (API endpoints)
│   ├── storage.ts (database operations)
│   └── index.ts
├── shared/
│   └── schema.ts (database schema)
└── package.json
```

## API Endpoints Structure
```
GET  /api/auth/user - Get current user
POST /api/auth/login - User login
POST /api/auth/logout - User logout
GET  /api/jobs - Get all jobs
POST /api/jobs - Create new job (parent only)
GET  /api/applications/my - Get user's applications
POST /api/applications - Apply to job (caregiver only)
GET  /api/nannies/featured - Get featured caregivers
GET  /api/caregiver/bookings - Get caregiver bookings
GET  /api/parent/bookings - Get parent bookings
```

## Current Issues & Next Steps
1. **Database Error**: SQL syntax error in getUserBookings function (line 367 in storage.ts)
2. **Type Errors**: Some TypeScript errors in messages.tsx and nanny-profile.tsx
3. **Police Badge Data**: Need to ensure hasPoliceCheck field is properly set in database

## Key Features Working
- ✅ Role-based authentication and access control
- ✅ Job posting and application system
- ✅ Profile completion calculation (0% when empty)
- ✅ Color theme implementation (warm orange profile cards)
- ✅ Police clearance badge display
- ✅ Separate parent/caregiver booking pages
- ✅ Enhanced parent profile photos on job board
- ✅ Caregiver dashboard with warm orange theme

## Deployment Configuration
- **Platform**: Replit
- **Database**: PostgreSQL (Neon)
- **Environment**: Node.js with TypeScript
- **Build**: Vite for frontend, Express for backend
- **Port**: 5000 (serves both frontend and backend)

## Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `RESEND_API_KEY` - Email service API key

---

**Instructions for ChatGPT:**
This is the current state of the VIVALY childcare platform. The most recent work focused on:
1. Fixing profile completion to show 0% when no optional fields filled
2. Adding warm orange color theme to caregiver dashboard
3. Implementing police clearance badges for caregivers
4. Creating separate parent/caregiver booking pages
5. Role-based job access controls

The platform is functional but has some database errors and TypeScript issues that need addressing. The core features are working well, and the design improvements have been successfully implemented.