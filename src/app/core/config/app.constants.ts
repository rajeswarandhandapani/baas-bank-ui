// Application-wide constants for BaaS Bank UI
export const KEYCLOAK_BASE_URL = 'http://localhost:8089/realms/baas';
export const KEYCLOAK_CLIENT_ID = 'banking-app';
export const KEYCLOAK_TOKEN_ENDPOINT = `${KEYCLOAK_BASE_URL}/protocol/openid-connect/token`;
export const KEYCLOAK_LOGOUT_ENDPOINT = `${KEYCLOAK_BASE_URL}/protocol/openid-connect/logout`;

// API Configuration
export const API_BASE_URL = '/api';

export const BACKEND_MODE: 'orchestrated' | 'choreographed' = 'orchestrated';
export const PAYMENT_ENDPOINT = '/api/saga/start/payment-processing';
export const ONBOARDING_ENDPOINT = '/api/saga/start/user-onboarding';
