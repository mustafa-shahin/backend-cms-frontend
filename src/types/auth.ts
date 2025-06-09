
export enum UserRole {
  Customer = 0,
  Admin = 1,
  Dev = 2
}

export interface User {
  id: number; 
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  role: UserRole;
  roleDisplayName: string;
  isActive: boolean;
  isLocked: boolean;
  lastLoginAt?: string;
  avatar?: string;
  timezone?: string;
  language?: string;
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  preferences: Record<string, any>;
  
  // Optional 2FA fields
  twoFactorEnabled?: boolean;
  recoveryCodes?: string[];
  
  // Optional personal info
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  
  // Optional billing/shipping addresses
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  billingPostalCode?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCountry?: string;
  shippingPostalCode?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
  requiresTwoFactor: boolean;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  timezone?: string;
  language?: string;
  preferences?: Record<string, any>;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}