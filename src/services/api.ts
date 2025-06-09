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
} from '../types/company';
import {
  Location,
  CreateLocationRequest,
  UpdateLocationRequest 
} from '../types/location';
import { 
  FileEntity, 
  Folder, 
  CreateFolderRequest, 
  UpdateFolderRequest, 
  FileUploadRequest 
} from '../types/file';
import { 
  Address, 
  CreateAddressRequest, 
  UpdateAddressRequest 
} from '../types/address';
import { 
  ContactDetails, 
  CreateContactDetailsRequest, 
  UpdateContactDetailsRequest 
} from '../types/contact';

import { CreateUserRequest, UpdateUserRequest, UserListItem } from '../types/user';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5252/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
  this.api = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Id': 'default',
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

  // async register(userData: RegisterRequest): Promise<void> {
  //   await this.api.post('/auth/register', userData);
  // }
async register(userData: RegisterRequest): Promise<void> {

  try {
    const response = await this.api.post('/auth/register', userData);
    console.log('Register response:', response.data);
  } catch (error: any) {
    console.error('Register error:', error.response?.data || error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    throw error;
  }
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

  async getPage(id: number): Promise<Page> {
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

  async updatePage(id: number, data: UpdatePageRequest): Promise<Page> {
    const response: AxiosResponse<Page> = await this.api.put(`/pages/${id}`, data);
    return response.data;
  }

  async deletePage(id: number): Promise<void> {
    await this.api.delete(`/pages/${id}`);
  }

  async publishPage(id: number): Promise<Page> {
    const response: AxiosResponse<Page> = await this.api.post(`/pages/${id}/publish`);
    return response.data;
  }

  async unpublishPage(id: number): Promise<Page> {
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

  async getUser(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/users', data);
    return response.data;
  }

  async updateUser(id: number, data: UpdateUserRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  async activateUser(id: number): Promise<void> {
    await this.api.post(`/users/${id}/activate`);
  }

  async deactivateUser(id: number): Promise<void> {
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

  async getLocation(id: number): Promise<Location> {
    const response: AxiosResponse<Location> = await this.api.get(`/company/locations/${id}`);
    return response.data;
  }

  async createLocation(data: CreateLocationRequest): Promise<Location> {
    const response: AxiosResponse<Location> = await this.api.post('/company/locations', data);
    return response.data;
  }

  async updateLocation(id: number, data: UpdateLocationRequest): Promise<Location> {
    const response: AxiosResponse<Location> = await this.api.put(`/company/locations/${id}`, data);
    return response.data;
  }

  async deleteLocation(id: number): Promise<void> {
    await this.api.delete(`/company/locations/${id}`);
  }

  async setMainLocation(id: number): Promise<void> {
    await this.api.post(`/company/locations/${id}/set-main`);
  }
async uploadFile(uploadData: FormData): Promise<FileEntity> {
  const response: AxiosResponse<FileEntity> = await this.api.post('/files/upload', uploadData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
async uploadMultipleFiles(uploadData: FormData): Promise<FileEntity[]> {
  const response: AxiosResponse<FileEntity[]> = await this.api.post('/files/upload/multiple', uploadData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}


  async getFile(id: number): Promise<FileEntity> {
    const response: AxiosResponse<FileEntity> = await this.api.get(`/files/${id}`);
    return response.data;
  }

async getFiles(page: number = 1, pageSize: number = 20, folderId?: number): Promise<{ items: FileEntity[], totalCount: number }> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  
  if (folderId) {
    params.append('folderId', folderId.toString());
  }
  
  const response: AxiosResponse<{ items: FileEntity[], totalCount: number }> = await this.api.get(`/files?${params}`);
  return response.data;
}

  async getFilesByFolder(folderId?: number, page: number = 1, pageSize: number = 20): Promise<FileEntity[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    const endpoint = folderId ? `/files/folder/${folderId}?${params}` : `/files?${params}`;
    const response: AxiosResponse<FileEntity[]> = await this.api.get(endpoint);
    return response.data;
  }
async getFileById(id: number): Promise<FileEntity> {
  const response: AxiosResponse<FileEntity> = await this.api.get(`/files/${id}`);
  return response.data;
}

async downloadFile(id: number): Promise<Blob> {
  const response: AxiosResponse<Blob> = await this.api.get(`/files/${id}/download`, {
    responseType: 'blob',
  });
  return response.data;
}

  async getFilePreview(id: number): Promise<FileEntity> {
    const response: AxiosResponse<FileEntity> = await this.api.get(`/files/${id}/preview`);
    return response.data;
  }
async searchFiles(searchTerm: string, page: number = 1, pageSize: number = 20): Promise<{ items: FileEntity[], totalCount: number }> {
  const params = new URLSearchParams({
    searchTerm,
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  
  const response: AxiosResponse<{ items: FileEntity[], totalCount: number }> = await this.api.post(`/files/search`, {
    searchTerm,
    page,
    pageSize,
  });
  return response.data;
}

async deleteFile(id: number): Promise<void> {
  await this.api.delete(`/files/${id}`);
}

  async deleteMultipleFiles(fileIds: number[]): Promise<void> {
    await this.api.post('/files/delete/multiple', { fileIds });
  }





  async getRecentFiles(count: number = 10): Promise<FileEntity[]> {
    const response: AxiosResponse<FileEntity[]> = await this.api.get(`/files/recent?count=${count}`);
    return response.data;
  }



  // Folders endpoints
async createFolder(data: CreateFolderRequest): Promise<Folder> {
  const response: AxiosResponse<Folder> = await this.api.post('/folders', data);
  return response.data;
}

  async getFolderById(id: number): Promise<Folder> {
    const response: AxiosResponse<Folder> = await this.api.get(`/folders/${id}`);
    return response.data;
  }

async getFolders(parentFolderId?: number): Promise<Folder[]> {
  const params = new URLSearchParams();
  if (parentFolderId) {
    params.append('parentFolderId', parentFolderId.toString());
  }
  
  const response: AxiosResponse<Folder[]> = await this.api.get(`/folders?${params}`);
  return response.data;
}

async updateFolder(id: number, data: UpdateFolderRequest): Promise<Folder> {
  const response: AxiosResponse<Folder> = await this.api.put(`/folders/${id}`, data);
  return response.data;
}

async deleteFolder(id: number, deleteFiles: boolean = false): Promise<void> {
  await this.api.delete(`/folders/${id}?deleteFiles=${deleteFiles}`);
}

async getFolderTree(rootFolderId?: number): Promise<any> {
  const params = new URLSearchParams();
  if (rootFolderId) {
    params.append('rootFolderId', rootFolderId.toString());
  }
  
  const response = await this.api.get(`/folders/tree?${params}`);
  return response.data;
}


  async copyFolder(folderId: number, destinationFolderId?: number, newName?: string): Promise<Folder> {
    const response: AxiosResponse<Folder> = await this.api.post('/folders/copy', {
      folderId,
      destinationFolderId,
      newName
    });
    return response.data;
  }

  async searchFolders(searchTerm: string): Promise<Folder[]> {
    const response: AxiosResponse<Folder[]> = await this.api.get(`/folders/search?searchTerm=${encodeURIComponent(searchTerm)}`);
    return response.data;
  }

  async getFolderStatistics(folderId: number): Promise<Record<string, any>> {
    const response: AxiosResponse<Record<string, any>> = await this.api.get(`/folders/${folderId}/statistics`);
    return response.data;
  }
async getAddressesByEntity(entityType: string, entityId: number): Promise<Address[]> {
  const response: AxiosResponse<Address[]> = await this.api.get(`/addresses/entity/${entityType}/${entityId}`);
  return response.data;
}

async createAddress(data: CreateAddressRequest, entityType: string, entityId: number): Promise<Address> {
  const response: AxiosResponse<Address> = await this.api.post(`/addresses`, {
    ...data,
    entityType,
    entityId,
  });
  return response.data;
}

async updateAddress(id: number, data: UpdateAddressRequest): Promise<Address> {
  const response: AxiosResponse<Address> = await this.api.put(`/addresses/${id}`, data);
  return response.data;
}

async deleteAddress(id: number): Promise<void> {
  await this.api.delete(`/addresses/${id}`);
}

// Contact Details endpoints
async getContactDetailsByEntity(entityType: string, entityId: number): Promise<ContactDetails[]> {
  const response: AxiosResponse<ContactDetails[]> = await this.api.get(`/contact-details/entity/${entityType}/${entityId}`);
  return response.data;
}

async createContactDetails(data: CreateContactDetailsRequest, entityType: string, entityId: number): Promise<ContactDetails> {
  const response: AxiosResponse<ContactDetails> = await this.api.post(`/contact-details`, {
    ...data,
    entityType,
    entityId,
  });
  return response.data;
}

async updateContactDetails(id: number, data: UpdateContactDetailsRequest): Promise<ContactDetails> {
  const response: AxiosResponse<ContactDetails> = await this.api.put(`/contact-details/${id}`, data);
  return response.data;
}

async deleteContactDetails(id: number): Promise<void> {
  await this.api.delete(`/contact-details/${id}`);
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
  getPage: (id: number) => apiService.getPage(id),
  getPageBySlug: (slug: string) => apiService.getPageBySlug(slug),
  createPage: (data: CreatePageRequest) => apiService.createPage(data),
  updatePage: (id: number, data: UpdatePageRequest) => apiService.updatePage(id, data),
  deletePage: (id: number) => apiService.deletePage(id),
  publishPage: (id: number) => apiService.publishPage(id),
  unpublishPage: (id: number) => apiService.unpublishPage(id),
  validateSlug: (slug: string, excludePageId?: string) => apiService.validateSlug(slug, excludePageId),
};

export const usersApi = {
  getUsers: (page?: number, pageSize?: number, search?: string) => apiService.getUsers(page, pageSize, search),
  getUser: (id: number) => apiService.getUser(id),
  createUser: (data: CreateUserRequest) => apiService.createUser(data),
  updateUser: (id: number, data: UpdateUserRequest) => apiService.updateUser(id, data),
  deleteUser: (id: number) => apiService.deleteUser(id),
  activateUser: (id: number) => apiService.activateUser(id),
  deactivateUser: (id: number) => apiService.deactivateUser(id),
};

export const companyApi = {
  getCompany: () => apiService.getCompany(),
  updateCompany: (data: UpdateCompanyRequest) => apiService.updateCompany(data),
  getLocations: () => apiService.getLocations(),
  getLocation: (id: number) => apiService.getLocation(id),
  createLocation: (data: CreateLocationRequest) => apiService.createLocation(data),
  updateLocation: (id: number, data: UpdateLocationRequest) => apiService.updateLocation(id, data),
  deleteLocation: (id: number) => apiService.deleteLocation(id),
  setMainLocation: (id: number) => apiService.setMainLocation(id),
};
export const filesApi = {
  getFiles: (page?: number, pageSize?: number, folderId?: number) => apiService.getFiles(page, pageSize, folderId),
  getFileById: (id: number) => apiService.getFileById(id),
  uploadFile: (uploadData: FormData) => apiService.uploadFile(uploadData),
  uploadMultipleFiles: (uploadData: FormData) => apiService.uploadMultipleFiles(uploadData),
  downloadFile: (id: number) => apiService.downloadFile(id),
  deleteFile: (id: number) => apiService.deleteFile(id),
  searchFiles: (searchTerm: string, page?: number, pageSize?: number) => apiService.searchFiles(searchTerm, page, pageSize),
};
export const foldersApi = {
  getFolders: (parentFolderId?: number) => apiService.getFolders(parentFolderId),
  getFolderById: (id: number) => apiService.getFolderById(id),
  createFolder: (data: CreateFolderRequest) => apiService.createFolder(data),
  updateFolder: (id: number, data: UpdateFolderRequest) => apiService.updateFolder(id, data),
  deleteFolder: (id: number, deleteFiles?: boolean) => apiService.deleteFolder(id, deleteFiles),
  getFolderTree: (rootFolderId?: number) => apiService.getFolderTree(rootFolderId),
};

export const addressApi = {
  getAddressesByEntity: (entityType: string, entityId: number) => apiService.getAddressesByEntity(entityType, entityId),
  createAddress: (data: CreateAddressRequest, entityType: string, entityId: number) => apiService.createAddress(data, entityType, entityId),
  updateAddress: (id: number, data: UpdateAddressRequest) => apiService.updateAddress(id, data),
  deleteAddress: (id: number) => apiService.deleteAddress(id),
};

export const contactDetailsApi = {
  getContactDetailsByEntity: (entityType: string, entityId: number) => apiService.getContactDetailsByEntity(entityType, entityId),
  createContactDetails: (data: CreateContactDetailsRequest, entityType: string, entityId: number) => apiService.createContactDetails(data, entityType, entityId),
  updateContactDetails: (id: number, data: UpdateContactDetailsRequest) => apiService.updateContactDetails(id, data),
  deleteContactDetails: (id: number) => apiService.deleteContactDetails(id),
};
export default apiService;