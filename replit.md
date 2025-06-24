# VIVALY Care Platform

## Overview

VIVALY is a comprehensive childcare marketplace platform connecting Australian families with verified caregivers. The platform enables dual-role user authentication, allowing users to function as both parents seeking care and caregivers offering services. It features job posting, application management, messaging, booking systems, and automated email notifications.

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Tailwind CSS with Shadcn/ui component library
- **Authentication**: Session-based authentication with role switching

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with PostgreSQL store
- **Security**: Helmet for security headers, rate limiting, CORS protection
- **Error Monitoring**: Sentry integration for production error tracking

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Session Store**: PostgreSQL-backed session storage
- **File Storage**: Profile images and document uploads (configured for cloud storage)
- **Schema Management**: Drizzle migrations for database versioning

## Key Components

### Authentication System
- **Dual-Role Support**: Users can switch between "parent" and "caregiver" roles
- **Session Persistence**: 7-day session duration with PostgreSQL backing
- **Role-Based Authorization**: Middleware enforcing role-specific access controls
- **Security Features**: Rate limiting on auth endpoints, secure cookie configuration

### User Management
- **Profile System**: Comprehensive profiles for both parents and caregivers
- **Verification Process**: Background checks, document uploads, identity verification
- **Multi-Role Accounts**: Single users can have multiple roles with seamless switching

### Job Marketplace
- **Job Posting**: Parents can create detailed job listings with requirements
- **Application System**: Caregivers can apply to jobs with cover letters
- **Search & Filtering**: Location-based search with service type filters
- **Real-time Updates**: Dynamic job board with instant notifications

### Communication Platform
- **In-App Messaging**: Direct messaging between parents and caregivers
- **Application Notifications**: Automated alerts for job applications
- **Email Integration**: SendGrid-powered email notifications and sequences

### Booking & Payment System
- **Airbnb-Style Booking**: Service booking with confirmation workflow
- **Payment Processing**: Stripe integration for secure transactions
- **Automatic Release**: 24-hour payment hold system for protection

## Data Flow

### User Registration Flow
1. User signs up with email/password
2. Email verification sent via sendGrid
3. Role selection (parent/caregiver/both)
4. Profile completion with role-specific fields
5. Document verification for caregivers
6. Account activation upon approval

### Job Application Flow
1. Parent posts job with requirements
2. Job appears on caregiver job board
3. Caregiver submits application with cover letter
4. Parent receives notification and reviews application
5. Communication initiated through messaging system
6. Booking confirmation and payment processing

### Role Switching Flow
1. User requests role switch via API
2. Session updated with new active role
3. Frontend re-fetches user data
4. Dashboard and navigation updated for new role
5. Role-specific features and permissions applied

## External Dependencies

### Email Services
- **SendGrid**: Email automation, notifications, and marketing sequences
- **Configuration**: Domain authentication required for production

### Payment Processing
- **Stripe**: Credit card processing and payment management
- **Webhooks**: Automated payment confirmation and release

### Database Infrastructure
- **PostgreSQL**: Primary data storage with connection pooling
- **Neon Database**: Serverless PostgreSQL provider

### Security & Monitoring
- **Sentry**: Error tracking and performance monitoring
- **Helmet**: Security headers and CORS protection
- **Express Rate Limit**: Brute force protection

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for Replit development environment
- **Hot Reloading**: Vite development server with HMR
- **Database**: PostgreSQL 16 module with automatic provisioning

### Production Build Process
1. Frontend assets built with Vite
2. Backend TypeScript compiled with esbuild
3. Database migrations applied via Drizzle
4. Environment variables configured for production services

### Scaling Configuration
- **Autoscale Deployment**: Configured for automatic scaling
- **Session Persistence**: PostgreSQL-backed sessions for multi-instance support
- **Connection Pooling**: Database connection optimization

## Changelog
- June 24, 2025. Initial setup
- June 24, 2025. Implemented Progressive Web App (PWA) functionality for mobile app experience
- June 24, 2025. Started native mobile app development with Capacitor for iOS and Android app stores
- June 24, 2025. Implemented comprehensive safety verification system for WWCC, police clearance, and identity document processing with automated verification and manual review workflows

## User Preferences

Preferred communication style: Simple, everyday language.