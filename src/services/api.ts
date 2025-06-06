import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  RefreshTokenRequest 
} from '../types/auth';
import { 
  Page, 
  CreatePageRequest, 
  UpdatePageRequest,
  PageListItem 
} from '../types/page';
import { 
  Company, 
  UpdateCompanyRequest,
  Location,
  CreateLocationRequest,
  UpdateLocationRequest 
} from '../types/company';
import { CreateUserRequest, UpdateUserRequest, UserListItem } from '../types/user';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5252/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-Id': 'default', // Default tenant for now
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshToken({ refreshToken });
              localStorage.setItem('token', response.accessToken);
              localStorage.setItem('refreshToken', response.refreshToken);
              
              // Retry the original request
              error.config.headers.Authorization = `Bearer ${response.accessToken}`;
              return this.api.request(error.config);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<void> {
    await this.api.post('/auth/register', userData);
  }

  async logout(data: { refreshToken: string }): Promise<void> {
    await this.api.post('/auth/logout', data);
  }

  async refreshToken(data: RefreshTokenRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/refresh', data);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/me');
    return response.data;
  }

  // Pages endpoints
  async getPages(page: number = 1, pageSize: number = 10, search?: string): Promise<{ items: PageListItem[], totalCount: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response: AxiosResponse<{ items: PageListItem[], totalCount: number }> = await this.api.get(`/pages?${params}`);
    return response.data;
  }

  async getPage(id: string): Promise<Page> {
    const response: AxiosResponse<Page> = await this.api.get(`/pages/${id}`);
    return response.data;
  }

  async getPageBySlug(slug: string): Promise<Page> {
    const response: AxiosResponse<Page> = await this.api.get(`/pages/by-slug/${slug}`);
    return response.data;
  }

  async createPage(data: CreatePageRequest): Promise<Page> {
    const response: AxiosResponse<Page> = await this.api.post('/pages', data);
    return response.data;
  }

  async updatePage(id: string, data: UpdatePageRequest): Promise<Page> {
    const response: AxiosResponse<Page> = await this.api.put(`/pages/${id}`, data);
    return response.data;
  }

  async deletePage(id: string): Promise<void> {
    await this.api.delete(`/pages/${id}`);
  }

  async publishPage(id: string): Promise<Page> {
    const response: AxiosResponse<Page> = await this.api.post(`/pages/${id}/publish`);
    return response.data;
  }

  async unpublishPage(id: string): Promise<Page> {
    const response: AxiosResponse<Page> = await this.api.post(`/pages/${id}/unpublish`);
    return response.data;
  }

  async validateSlug(slug: string, excludePageId?: string): Promise<{ isValid: boolean }> {
    const params = new URLSearchParams({ slug });
    if (excludePageId) {
      params.append('excludePageId', excludePageId);
    }
    
    const response: AxiosResponse<{ isValid: boolean }> = await this.api.get(`/pages/validate-slug?${params}`);
    return response.data;
  }

  // Users endpoints
  async getUsers(page: number = 1, pageSize: number = 10, search?: string): Promise<{ items: UserListItem[], totalCount: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response: AxiosResponse<{ items: UserListItem[], totalCount: number }> = await this.api.get(`/users?${params}`);
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/users', data);
    return response.data;
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  async activateUser(id: string): Promise<void> {
    await this.api.post(`/users/${id}/activate`);
  }

  async deactivateUser(id: string): Promise<void> {
    await this.api.post(`/users/${id}/deactivate`);
  }

  // Company endpoints
  async getCompany(): Promise<Company> {
    const response: AxiosResponse<Company> = await this.api.get('/company');
    return response.data;
  }

  async updateCompany(data: UpdateCompanyRequest): Promise<Company> {
    const response: AxiosResponse<Company> = await this.api.put('/company', data);
    return response.data;
  }

  // Locations endpoints
  async getLocations(): Promise<Location[]> {
    const response: AxiosResponse<Location[]> = await this.api.get('/company/locations');
    return response.data;
  }

  async getLocation(id: string): Promise<Location> {
    const response: AxiosResponse<Location> = await this.api.get(`/company/locations/${id}`);
    return response.data;
  }

  async createLocation(data: CreateLocationRequest): Promise<Location> {
    const response: AxiosResponse<Location> = await this.api.post('/company/locations', data);
    return response.data;
  }

  async updateLocation(id: string, data: UpdateLocationRequest): Promise<Location> {
    const response: AxiosResponse<Location> = await this.api.put(`/company/locations/${id}`, data);
    return response.data;
  }

  async deleteLocation(id: string): Promise<void> {
    await this.api.delete(`/company/locations/${id}`);
  }

  async setMainLocation(id: string): Promise<void> {
    await this.api.post(`/company/locations/${id}/set-main`);
  }
}

// Export individual API groups for better organization
export const apiService = new ApiService();

export const authApi = {
  login: (credentials: LoginRequest) => apiService.login(credentials),
  register: (userData: RegisterRequest) => apiService.register(userData),
  logout: (data: { refreshToken: string }) => apiService.logout(data),
  refreshToken: (data: RefreshTokenRequest) => apiService.refreshToken(data),
  getCurrentUser: () => apiService.getCurrentUser(),
};

export const pagesApi = {
  getPages: (page?: number, pageSize?: number, search?: string) => apiService.getPages(page, pageSize, search),
  getPage: (id: string) => apiService.getPage(id),
  getPageBySlug: (slug: string) => apiService.getPageBySlug(slug),
  createPage: (data: CreatePageRequest) => apiService.createPage(data),
  updatePage: (id: string, data: UpdatePageRequest) => apiService.updatePage(id, data),
  deletePage: (id: string) => apiService.deletePage(id),
  publishPage: (id: string) => apiService.publishPage(id),
  unpublishPage: (id: string) => apiService.unpublishPage(id),
  validateSlug: (slug: string, excludePageId?: string) => apiService.validateSlug(slug, excludePageId),
};

export const usersApi = {
  getUsers: (page?: number, pageSize?: number, search?: string) => apiService.getUsers(page, pageSize, search),
  getUser: (id: string) => apiService.getUser(id),
  createUser: (data: CreateUserRequest) => apiService.createUser(data),
  updateUser: (id: string, data: UpdateUserRequest) => apiService.updateUser(id, data),
  deleteUser: (id: string) => apiService.deleteUser(id),
  activateUser: (id: string) => apiService.activateUser(id),
  deactivateUser: (id: string) => apiService.deactivateUser(id),
};

export const companyApi = {
  getCompany: () => apiService.getCompany(),
  updateCompany: (data: UpdateCompanyRequest) => apiService.updateCompany(data),
  getLocations: () => apiService.getLocations(),
  getLocation: (id: string) => apiService.getLocation(id),
  createLocation: (data: CreateLocationRequest) => apiService.createLocation(data),
  updateLocation: (id: string, data: UpdateLocationRequest) => apiService.updateLocation(id, data),
  deleteLocation: (id: string) => apiService.deleteLocation(id),
  setMainLocation: (id: string) => apiService.setMainLocation(id),
};

export default apiService;