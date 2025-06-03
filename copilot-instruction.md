# Copilot Instructions for BaaS Bank Frontend

## Authentication & Registration
- All login and registration flows must be handled exclusively via Keycloak.
- The Angular frontend must not implement custom registration or login forms.
- The application must redirect users to Keycloak login and registration pages for authentication and onboarding.
- User creation, password management, and authentication are managed by Keycloak only.

## Default Welcome Page
- The default landing page must be a Welcome Page introducing BaaS Bank, its features, and value proposition.
- The Welcome Page must provide prominent buttons/links for Login and Register (which redirect to Keycloak).
- The Welcome Page must use BaaS Bank branding, a professional theme, and a responsive layout.
- After successful login or registration, users must be redirected to their dashboard based on their role.

## General UI/UX
- Use Angular 17 with standalone components and Bootstrap 5.3.6 for all UI.
- Ensure all navigation and protected routes are guarded and role-based.
- All API integration must use the available endpoints as documented in the PRD.
- Do not implement features not supported by the backend API.
- Always do the changes step by step by breaking requiremnt into smaller.
-  implementing baas-bank UI step by step. rememeber only one small step at a time. parallelely update prd document for current progress.
