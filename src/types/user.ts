
import { UserRole } from './auth';

export interface UserListItem {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isLocked: boolean;
  lastLoginAt?: string;
  createdAt: string;
  role: UserRole;
  roleName: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive?: boolean;
  avatar?: string;
  timezone?: string;
  language?: string;
  role: UserRole;
  preferences?: Record<string, any>;
}

export interface UpdateUserRequest {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  avatar?: string;
  timezone?: string;
  language?: string;
  role: UserRole;
  preferences?: Record<string, any>;
}