# BaaS Bank - Product Requirements Document

## Project Overview

**Project Name**: BaaS Bank - Banking as a Service Frontend  
**Version**: 1.0.0  
**Date**: June 3, 2025  
**Platform**: Web Application (Angular 17 + Bootstrap 5.3.6)  
**Backend Integration**: Banking as a Service API (Spring Boot Microservices)

## Executive Summary

BaaS Bank is a modern, responsive web application that provides a complete banking interface for customers and administrators. Built with Angular 17 and Bootstrap 5.3.6, it serves as the frontend counterpart to the Banking as a Service API microservices platform, offering secure banking operations through an intuitive user interface.

## Technical Architecture

### Frontend Stack
- **Framework**: Angular 17 (Standalone Components)
- **UI Framework**: Bootstrap 5.3.6
- **State Management**: Angular Signals + Services
- **Authentication**: Angular JWT + Keycloak Integration
- **HTTP Client**: Angular HttpClient with Interceptors
- **Routing**: Angular Router with Guards
- **Forms**: Angular Reactive Forms
- **Icons**: Bootstrap Icons + Font Awesome
- **Build Tool**: Angular CLI with Webpack

### Backend Integration
- **API Gateway**: http://localhost:8080 (Banking as a Service)
- **Authentication**: Keycloak OAuth 2.0/OpenID Connect
- **Communication**: RESTful APIs (Real-time notifications not available)
- **Security**: JWT Bearer Tokens

## User Roles & Permissions

### 1. Account Holder (Customer)
**Primary Users**: Individual banking customers  
**Key Capabilities**:
- Account management and balance inquiry
- Fund transfers and payments
- Transaction history and statements
- Profile management
- Notifications and alerts

### 2. BaaS Admin (Bank Administrator)
**Primary Users**: Bank administrators and support staff  
**Key Capabilities**:
- All customer operations (view-only or administrative)
- User management and account oversight
- Transaction monitoring and dispute resolution
- Audit trail access and reporting
- System administration functions

## Core Features & Requirements

*Based on Currently Available Banking as a Service API Endpoints*

### Available API Endpoints (Updated from Postman Collection Analysis)

#### User Service (/api/users)
- ✅ `GET /api/users` - List all users (likely BAAS_ADMIN only)
- ✅ `GET /api/users/me` - Get current user profile
- ✅ `POST /api/users` - User registration (no payload defined in collection)
- ✅ Role-based access control (BAAS_ADMIN, ACCOUNT_HOLDER)

#### Account Service (/api/accounts)
- ✅ `GET /api/accounts` - List all accounts (BAAS_ADMIN only)
- ✅ `GET /api/accounts/my-accounts` - Get user's own accounts

#### Payment Service (/api/payments)
- ✅ `POST /api/payments` - Create new payment (Payment Processing Saga)  
  **Payload Structure:**
  ```json
  {
    "sourceAccountNumber": "904662",
    "destinationAccountNumber": "334861", 
    "amount": 25.00,
    "reference": "Testing payment"
  }
  ```
- ✅ `GET /api/payments` - List all payments (BAAS_ADMIN only)
- ✅ `GET /api/payments/my-payments` - Get user's own payments

#### Transaction Service (/api/transactions)
- ✅ `GET /api/transactions` - List all transactions (likely BAAS_ADMIN only)
- ✅ `GET /api/transactions/my-transactions` - Get user's own transactions

#### Audit Service (/api/audit-logs)
- ✅ `GET /api/audit-logs` - Get audit logs (BAAS_ADMIN only)

### Important API Changes Identified:
1. **User Registration**: Now uses `POST /api/users` instead of saga endpoint
2. **My Transactions**: New endpoint `GET /api/transactions/my-transactions` available
3. **All Transactions**: `GET /api/transactions` for admin access

### Phase 1: Authentication & User Management (Priority: High)

#### 1.1 User Authentication
- **Login Page**: Keycloak integration with OAuth 2.0/OpenID Connect
- **JWT Token Management**: Automatic token refresh and secure storage
- **Role-based Access**: Dynamic navigation and feature access based on user roles
- **Logout**: Secure session termination with token cleanup

#### 1.2 User Registration & Onboarding
- **Registration Form**: Uses `POST /api/users` endpoint (no defined payload structure)
- **Simple User Registration**: Direct user creation without saga integration
- **Success Notification**: Display success message after user creation
- **Account Creation**: Handled separately or automatically by backend

#### 1.3 Profile Management
- **View Profile**: Uses `GET /api/users/me` endpoint
- **Display Current User**: Show authenticated user information
- **Password Management**: Redirect to Keycloak for password changes

### Phase 2: Account Management (Priority: High)

#### 2.1 Account Dashboard  
- **My Accounts**: Uses `GET /api/accounts/my-accounts` endpoint
- **Account List Display**: Show user's accounts with basic information
- **Quick Navigation**: Links to payment and transaction sections

#### 2.2 Account Details (Limited by API)
- **Basic Account Information**: Display account data from my-accounts endpoint
- **Account Selection**: Switch between multiple accounts if available

### Phase 3: Payment Operations (Priority: High)

#### 3.1 Payment Processing
- **Payment Creation**: Uses `POST /api/payments` endpoint
- **Payment Processing Saga**: Integration with backend Payment Processing Saga
- **Payment Form**: Source account, destination account, amount, reference
- **Payment Confirmation**: Success/failure feedback

#### 3.2 Payment History
- **My Payments**: Uses `GET /api/payments/my-payments` endpoint
- **Payment List**: Display user's payment history
- **Basic Payment Details**: Show payment information available from API

### Phase 4: Transaction Management (Priority: High)

#### 4.1 Transaction History
- **My Transaction History**: Uses `GET /api/transactions/my-transactions` endpoint for user's own transactions
- **All Transaction History**: Uses `GET /api/transactions` endpoint for admin access (BAAS_ADMIN only)
- **Basic Transaction Display**: Show transaction data available from API
- **Simple Transaction View**: Display transaction information with role-based access

### Phase 5: Administrative Features (Priority: Medium) - BAAS_ADMIN Only

#### 5.1 Admin Dashboard
- **All Accounts**: Uses `GET /api/accounts` endpoint
- **All Payments**: Uses `GET /api/payments` endpoint  
- **Audit Logs**: Uses `GET /api/audit-logs` endpoint
- **Admin Overview**: Basic administrative view of system data

#### 5.2 Audit Trail Access
- **Audit Log Viewer**: Display audit trail information
- **Admin-Only Access**: Restricted to BAAS_ADMIN role

#### Future Implementation (When Backend APIs Become Available):
- **Account Closure Saga**: When account closure endpoints are implemented
- **Transaction Dispute Saga**: When dispute handling endpoints are implemented  
- **Advanced User Management**: When user CRUD operations are available
- **Real-time Features**: When WebSocket/SSE endpoints are implemented
- **Enhanced Reporting**: When analytics endpoints are available

## User Experience Requirements

### Design Principles
- **Mobile-First**: Responsive design optimized for mobile devices
- **Accessibility**: WCAG 2.1 AA compliance for inclusive design
- **Performance**: Fast loading times with optimized bundle sizes
- **Consistency**: Uniform UI patterns and design language
- **Security**: Clear security indicators and user guidance

### Visual Design
- **Color Scheme**: Professional banking theme with blue/white primary colors
- **Typography**: Clear, readable fonts (Bootstrap default font stack)
- **Icons**: Consistent icon usage (Bootstrap Icons + Font Awesome)
- **Layout**: Card-based layout with clear information hierarchy
- **Branding**: BaaS Bank branding with modern, trustworthy appearance

### Navigation Structure
```
BaaS Bank Application (Aligned with Available APIs)
├── Login/Register (Keycloak)
├── Dashboard (Role-based)
│   ├── My Accounts (GET /api/accounts/my-accounts)
│   ├── Recent Payments (GET /api/payments/my-payments)
│   └── Quick Actions (New Payment)
├── Accounts
│   ├── My Accounts List
│   └── Account Details (Limited)
├── Payments
│   ├── Make Payment (POST /api/payments)
│   ├── My Payment History (GET /api/payments/my-payments)
│   └── Payment Status
├── Transactions
│   ├── My Transaction History (GET /api/transactions/my-transactions)
│   └── All Transactions (GET /api/transactions) - BAAS_ADMIN only
├── Profile
│   ├── View Profile (GET /api/users/me)
│   └── Change Password (Keycloak redirect)
└── Admin (BAAS_ADMIN only)
    ├── All Accounts (GET /api/accounts)
    ├── All Payments (GET /api/payments)
    └── Audit Logs (GET /api/audit-logs)
```

## Technical Requirements

### Frontend Architecture
- **Component Structure**: Standalone components with feature modules
- **State Management**: Angular Signals for reactive state management
- **Service Layer**: Injectable services for API communication
- **Guards**: Route guards for authentication and authorization
- **Interceptors**: HTTP interceptors for token management and error handling
- **Pipes**: Custom pipes for data formatting and filtering

### Performance Requirements
- **Initial Load Time**: < 3 seconds on 3G connection
- **Runtime Performance**: 60fps for animations and interactions
- **Bundle Size**: < 2MB for initial bundle, lazy-loaded feature modules
- **API Response Time**: < 500ms for standard operations
- **Offline Capability**: Basic offline viewing of cached data (future)

### Security Requirements
- **Authentication**: OAuth 2.0/OpenID Connect with Keycloak
- **Authorization**: Role-based access control with route guards
- **Token Management**: Secure JWT storage and automatic refresh
- **Input Validation**: Client-side and server-side validation
- **XSS Protection**: Sanitization of user inputs and outputs
- **CSRF Protection**: Angular built-in CSRF protection

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Responsive Design**: Mobile, tablet, and desktop viewport support
- **Progressive Enhancement**: Graceful degradation for older browsers

## API Integration Requirements

### Backend Service Integration (Available APIs Only)
- **User Service**: 
  - `GET /api/users` - List all users (BAAS_ADMIN only)
  - `GET /api/users/me` - Get current user profile
  - `POST /api/users` - User registration (direct endpoint)
- **Account Service**: 
  - `GET /api/accounts/my-accounts` - User's own accounts
  - `GET /api/accounts` - All accounts (BAAS_ADMIN only)
- **Payment Service**: 
  - `POST /api/payments` - Payment initiation (Payment Processing Saga)
  - `GET /api/payments/my-payments` - User's payment history
  - `GET /api/payments` - All payments (BAAS_ADMIN only)  
- **Transaction Service**: 
  - `GET /api/transactions` - All transactions (BAAS_ADMIN only)
  - `GET /api/transactions/my-transactions` - User's own transactions
- **Audit Service**: 
  - `GET /api/audit-logs` - Audit trail access (BAAS_ADMIN only)

## Implementation Phases & Timeline

### Phase 1: Foundation & Authentication (Weeks 1-2) ✅ ACHIEVABLE
- **Week 1**: Project setup, Angular 17 configuration, Bootstrap integration
- **Week 2**: Keycloak authentication integration, basic routing, role-based guards

**Deliverables**:
- ✅ Angular 17 project with Bootstrap 5.3.6
- ✅ Keycloak OAuth 2.0 authentication service
- ✅ JWT token management and guards
- ✅ Basic layout and navigation structure
- ✅ Login/logout functionality

### Phase 2: Core Banking Features (Weeks 3-4) ✅ ACHIEVABLE  
- **Week 3**: User registration (POST /api/users), profile view, account listing
- **Week 4**: Payment creation and history, basic dashboard

**Deliverables**:
- ✅ User registration using direct POST /api/users endpoint
- ✅ User profile display (GET /api/users/me)
- ✅ Account listing (GET /api/accounts/my-accounts)
- ✅ Payment creation (POST /api/payments)
- ✅ Payment history (GET /api/payments/my-payments)

### Phase 3: Transaction & Admin Features (Weeks 5-6) ✅ ACHIEVABLE
- **Week 5**: Transaction history, basic admin dashboard
- **Week 6**: Audit logs, admin account/payment views

**Deliverables**:
- ✅ Transaction history display (GET /api/transactions/my-transactions for users, GET /api/transactions for BAAS_ADMIN)
- ✅ Admin dashboard with role-based access
- ✅ Admin account overview (GET /api/accounts)
- ✅ Admin payment monitoring (GET /api/payments)
- ✅ Audit log access (GET /api/audit-logs)

### Phase 4: Polish & Testing (Weeks 7-8) ✅ ACHIEVABLE
- **Week 7**: UI/UX improvements, responsive design, error handling
- **Week 8**: Testing, documentation, performance optimization

**Deliverables**:
- ✅ Responsive design and mobile optimization
- ✅ Error handling and user feedback
- ✅ Loading states and UI improvements
- ✅ Unit and integration testing
- ✅ Documentation and deployment guide

## Success Metrics

### User Experience Metrics
- **User Satisfaction**: 90%+ user satisfaction rating
- **Task Completion Rate**: 95%+ for core banking operations
- **Error Rate**: < 1% for critical user flows
- **Mobile Usage**: 70%+ of traffic from mobile devices

### Performance Metrics
- **Page Load Time**: < 3 seconds average
- **API Response Time**: < 500ms average
- **Uptime**: 99.9% availability
- **Conversion Rate**: 80%+ registration completion rate

### Business Metrics
- **User Adoption**: Target user base engagement
- **Transaction Volume**: Successful transaction processing rate
- **Support Tickets**: Reduced support requests through intuitive UI
- **Compliance**: 100% security and accessibility compliance

## Risk Assessment & Mitigation

### Technical Risks
- **API Integration Complexity**: Mitigate with comprehensive testing and documentation
- **Authentication Issues**: Early Keycloak integration testing and fallback mechanisms
- **Performance Concerns**: Progressive loading and optimization strategies
- **Browser Compatibility**: Comprehensive cross-browser testing

### Security Risks
- **Token Management**: Secure storage and automatic refresh mechanisms
- **Input Validation**: Comprehensive client and server-side validation
- **Data Exposure**: Role-based access control and data masking
- **Session Management**: Proper session handling and timeout mechanisms

### User Experience Risks
- **Complex Navigation**: User testing and iterative UI improvements
- **Mobile Experience**: Mobile-first design approach and testing
- **Accessibility**: WCAG compliance testing and remediation
- **Performance on Low-end Devices**: Progressive enhancement and optimization

## Compliance & Standards

### Security Standards
- **OWASP Top 10**: Mitigation of common web application vulnerabilities
- **JWT Best Practices**: Secure token handling and storage
- **Data Protection**: GDPR compliance for user data handling
- **Authentication Standards**: OAuth 2.0/OpenID Connect compliance

### Accessibility Standards
- **WCAG 2.1 AA**: Comprehensive accessibility compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum contrast ratios for visual accessibility

### Development Standards
- **Code Quality**: ESLint, Prettier, and TypeScript strict mode
- **Testing Standards**: Unit testing (Jest), E2E testing (Cypress)
- **Documentation**: Comprehensive code and API documentation
- **Version Control**: Git best practices with feature branching

## Future Enhancements

### Phase 2 Features (Future Releases)
- **Advanced Analytics**: Machine learning-powered spending insights
- **Mobile App**: Native iOS and Android applications
- **Third-party Integrations**: External bank account linking
- **Advanced Security**: Biometric authentication, fraud detection
- **Investment Features**: Basic investment and savings products
- **Multi-language Support**: Internationalization and localization

### Technology Upgrades
- **Progressive Web App**: PWA capabilities for mobile-like experience
- **Real-time Features**: WebSocket integration for live updates
- **Offline Capabilities**: Service worker implementation
- **Performance Monitoring**: Real-time performance analytics
- **Advanced Testing**: Visual regression testing, performance testing

## Implementation Status Tracking

*Last Updated: June 3, 2025*

### ✅ Completed Features
- None (Project initiation phase)

### 🔄 In Progress
- PRD document creation and review
- Project setup and initial configuration

### ❌ Pending Implementation
- All features (as per implementation phases)

### 📊 Overall Progress
**Current Status**: 0% - Project Planning Phase  
**Scope**: Focused on available API endpoints only  
**Next Milestone**: Phase 1 - Foundation & Authentication (Weeks 1-2)  
**Expected Completion**: 4 phases over 8 weeks  
**API Coverage**: 100% of available backend endpoints will be integrated

### 🚧 Scope Limitations
**Important Note**: This frontend application is limited by the current Banking as a Service API capabilities. Many advanced banking features (account statements, real-time notifications, advanced analytics, etc.) are not available in the backend and therefore cannot be implemented in the frontend until the corresponding API endpoints are developed.

**Future Development**: When additional API endpoints become available (Account Closure Saga, Transaction Dispute Saga, etc.), the frontend can be enhanced accordingly.

---

**Document Version**: 1.0  
**Last Review Date**: June 3, 2025  
**Next Review Date**: June 10, 2025  
**Status**: Approved for Implementation

## Authentication & Registration Approach
- **All login and registration flows are handled exclusively via Keycloak.**
- The application will redirect users to the Keycloak login and registration pages for authentication and onboarding.
- No custom registration or login forms will be implemented in the Angular frontend.
- User creation, password management, and authentication are managed by Keycloak only.

## 2025-06-03: Welcome Page CSS Refactor
- All custom styles removed from WelcomeComponent; now relies entirely on Bootstrap classes and shared styles in styles.scss.
- Shared hover effect classes (.baas-card-hover, .baas-btn-hover) moved to styles.scss for global reuse.
- Welcome Page and all components now use only Bootstrap and shared/global custom classes, with no component-specific CSS.
- Fully compliant with copilot-instructions.md: avoid custom CSS classes unless absolutely necessary, and use Bootstrap utilities as much as possible.

## 2025-06-03: Authentication Flow & Keycloak Integration Update
- All Keycloak configuration values (base URL, client ID, token endpoint) are now centralized in `app.constants.ts` for maintainability and consistency.
- The Welcome Page uses these constants for login and register redirection, ensuring all authentication flows are handled via Keycloak as required.
- The Register button now redirects to the login page, since self-registration is disabled in Keycloak (registrationAllowed: false).
- The Angular app is configured to handle the Keycloak login redirect at `/auth/callback`, where the authorization code is exchanged for tokens and securely stored.
- All login and registration flows are fully compliant with the copilot-instructions.md: no custom forms, only Keycloak-managed authentication.
- No errors in WelcomeComponent; all authentication logic is now consistent and maintainable.

## 2025-06-03: Dashboard Component Implementation
- Created a Dashboard component as the post-login landing page for authenticated users.
- Updated the auth-callback component to redirect users to the dashboard after successful login.
- Added proper route configuration for the dashboard with fallback routes for error handling.
- Dashboard includes placeholder sections for Accounts, Payments, and Transactions to be implemented in future steps.
- Fixed routing issues to ensure seamless navigation after authentication.

