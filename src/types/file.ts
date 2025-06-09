export enum FileType {
  Document = 0,
  Image = 1,
  Video = 2,
  Audio = 3,
  Archive = 4,
  Other = 5
}

export enum FolderType {
  General = 0,
  Images = 1,
  Documents = 2,
  Videos = 3,
  Audio = 4,
  UserAvatars = 5,
  CompanyAssets = 6,
  Temporary = 7
}

export interface FileEntity {
  id: number;
  originalFileName: string;
  storedFileName: string;
  filePath: string;
  contentType: string;
  fileSize: number;
  fileExtension: string;
  fileType: FileType;
  description?: string;
  alt?: string;
  metadata: Record<string, any>;
  isPublic: boolean;
  folderId?: number;
  folderPath?: string;
  downloadCount: number;
  lastAccessedAt?: string;
  thumbnailPath?: string;
  width?: number;
  height?: number;
  duration?: string;
  isProcessed: boolean;
  processingStatus?: string;
  tags: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  fileSizeFormatted: string;
  fileUrl: string;
  thumbnailUrl?: string;
  canPreview: boolean;
  canEdit: boolean;
}

export interface Folder {
  id: number;
  name: string;
  description?: string;
  path: string;
  parentFolderId?: number;
  parentFolderPath?: string;
  subFolders: Folder[];
  files: FileEntity[];
  isPublic: boolean;
  metadata: Record<string, any>;
  folderType: FolderType;
  createdAt: string;
  updatedAt: string;
  fileCount: number;
  subFolderCount: number;
  totalSize: number;
  totalSizeFormatted: string;
}

export interface CreateFolderRequest {
  name: string;
  description?: string;
  parentFolderId?: number;
  isPublic?: boolean;
  folderType?: FolderType;
  metadata?: Record<string, any>;
}

export interface UpdateFolderRequest {
  name: string;
  description?: string;
  isPublic: boolean;
  metadata?: Record<string, any>;
}

export interface FileUploadRequest {
  file: File;
  description?: string;
  alt?: string;
  folderId?: number;
  isPublic?: boolean;
  tags?: Record<string, any>;
  generateThumbnail?: boolean;
}