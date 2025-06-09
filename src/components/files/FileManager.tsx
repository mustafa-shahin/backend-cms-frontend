// src/components/files/FileManager.tsx
import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { filesApi, foldersApi } from '../../services/api';
import { FileEntity, CreateFolderRequest } from '../../types/file';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import ConfirmDialog from '../ui/ConfirmDialog';
import {
  FolderIcon,
  FolderOpenIcon,
  DocumentIcon,
  PhotoIcon,
  DivideIcon,
  SpeakerWaveIcon,
  ArchiveBoxIcon,

  CloudArrowUpIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  FolderPlusIcon,
} from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface FileManagerProps {
  onFileSelect?: (file: FileEntity) => void;
  selectMode?: boolean;
  allowedTypes?: string[];
}

const FileManager: React.FC<FileManagerProps> = ({
  onFileSelect,
  selectMode = false,
  allowedTypes,
}) => {
  const [currentFolderId, setCurrentFolderId] = useState<number | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<FileEntity | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'file' | 'folder'; id: number; name: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: files, isLoading: filesLoading } = useQuery(
    ['files', currentFolderId],
    () => filesApi.getFiles(1, 50, currentFolderId),
    { keepPreviousData: true }
  );

  const { data: folders } = useQuery(
    ['folders', currentFolderId],
    () => foldersApi.getFolders(currentFolderId)
  );

  const { data: folderTree } = useQuery('folderTree', () => foldersApi.getFolderTree());

  const createFolderForm = useForm<CreateFolderRequest>();

  const uploadMutation = useMutation(filesApi.uploadFile, {
    onSuccess: () => {
      queryClient.invalidateQueries(['files']);
      toast.success('File uploaded successfully');
      setUploadModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    },
  });

  const createFolderMutation = useMutation(foldersApi.createFolder, {
    onSuccess: () => {
      queryClient.invalidateQueries(['folders']);
      toast.success('Folder created successfully');
      setCreateFolderModalOpen(false);
      createFolderForm.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create folder');
    },
  });

  const deleteFileMutation = useMutation(filesApi.deleteFile, {
    onSuccess: () => {
      queryClient.invalidateQueries(['files']);
      toast.success('File deleted successfully');
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete file');
    },
  });

  const deleteFolderMutation = useMutation(
    (id: number) => foldersApi.deleteFolder(id, false),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['folders']);
        toast.success('Folder deleted successfully');
        setDeleteConfirmOpen(false);
        setDeleteTarget(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to delete folder');
      },
    }
  );

  const getFileIcon = (file: FileEntity) => {
    switch (file.fileType) {
      case 1: // Image
        return <PhotoIcon className="h-5 w-5 text-green-500" />;
      case 2: // Video
        return <DivideIcon className="h-5 w-5 text-red-500" />;
      case 3: // Audio
        return <SpeakerWaveIcon className="h-5 w-5 text-purple-500" />;
      case 4: // Archive
        return <ArchiveBoxIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <DocumentIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', '');
    if (currentFolderId) {
      formData.append('folderId', currentFolderId.toString());
    }
    formData.append('isPublic', 'false');
    formData.append('generateThumbnail', 'true');

    uploadMutation.mutate(formData);
  };

  const handleDownload = async (file: FileEntity) => {
    try {
      const blob = await filesApi.downloadFile(file.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const handleDelete = (type: 'file' | 'folder', id: number, name: string) => {
    setDeleteTarget({ type, id, name });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'file') {
      deleteFileMutation.mutate(deleteTarget.id);
    } else {
      deleteFolderMutation.mutate(deleteTarget.id);
    }
  };

  const onCreateFolder = (data: CreateFolderRequest) => {
    createFolderMutation.mutate({
      ...data,
      parentFolderId: currentFolderId,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (filesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">File Manager</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCreateFolderModalOpen(true)}
            leftIcon={<FolderPlusIcon className="h-4 w-4" />}
          >
            New Folder
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<CloudArrowUpIcon className="h-4 w-4" />}
          >
            Upload
          </Button>
        </div>
      </div>

      {/* File input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {/* Navigation breadcrumb */}
      {currentFolderId && (
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setCurrentFolderId(undefined)}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            Root
          </button>
          <span className="text-gray-500 mx-2">/</span>
          <span className="text-gray-900 dark:text-white text-sm">Current Folder</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Folders */}
          {folders && folders.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Folders</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group"
                    onDoubleClick={() => setCurrentFolderId(folder.id)}
                  >
                    <FolderIcon className="h-8 w-8 text-blue-500 mr-3" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {folder.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {folder.fileCount} files
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete('folder', folder.id, folder.name);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {files && files.items.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Files</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {files.items.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group ${
                      selectMode ? 'hover:border-primary-500' : ''
                    }`}
                    onClick={() => {
                      if (selectMode && onFileSelect) {
                        onFileSelect(file);
                      } else {
                        setSelectedFile(file);
                      }
                    }}
                  >
                    <div className="mr-3">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.originalFileName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.fileSize)}
                      </p>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-700"
                        title="Download"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete('file', file.id, file.originalFileName);
                        }}
                        className="p-1 text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {(!files || files.items.length === 0) && (!folders || folders.length === 0) && (
            <div className="text-center py-12">
              <FolderOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No files or folders</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by uploading a file or creating a folder.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Folder Modal */}
      <Modal
        open={createFolderModalOpen}
        onClose={() => setCreateFolderModalOpen(false)}
        title="Create New Folder"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setCreateFolderModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={createFolderForm.handleSubmit(onCreateFolder)}
              loading={createFolderMutation.isLoading}
            >
              Create Folder
            </Button>
          </div>
        }
      >
        <form onSubmit={createFolderForm.handleSubmit(onCreateFolder)} className="space-y-4">
          <Input
            label="Folder Name"
            {...createFolderForm.register('name', { required: 'Folder name is required' })}
            error={createFolderForm.formState.errors.name?.message}
          />
          <Input
            label="Description (Optional)"
            {...createFolderForm.register('description')}
          />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete ${deleteTarget?.type}`}
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonVariant="danger"
        loading={deleteFileMutation.isLoading || deleteFolderMutation.isLoading}
      />
    </div>
  );
};

export default FileManager;