export interface UserListItem {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isLocked: boolean;
  lastLoginAt?: string;
  createdAt: string;
   role: string;
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
   role: string;
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
  role: string;
  preferences?: Record<string, any>;
}