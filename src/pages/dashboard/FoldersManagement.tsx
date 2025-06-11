import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { foldersApi } from "../../services/api";
import {
  Folder,
  CreateFolderRequest,
  UpdateFolderRequest,
  FolderType,
} from "../../types/file";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import DataTable, { Column } from "../../components/ui/DataTable";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  FolderOpenIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const FoldersManagement: React.FC = () => {
  const [currentFolderId, setCurrentFolderId] = useState<number | undefined>(
    undefined
  );
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  const queryClient = useQueryClient();

  const { data: folders, isLoading } = useQuery(
    ["folders", currentFolderId],
    () => foldersApi.getFolders(currentFolderId),
    { keepPreviousData: true }
  );

  const { data: folderTree } = useQuery("folderTree", () =>
    foldersApi.getFolderTree()
  );

  const createForm = useForm<CreateFolderRequest>();
  const editForm = useForm<UpdateFolderRequest>();

  const createMutation = useMutation(foldersApi.createFolder, {
    onSuccess: () => {
      queryClient.invalidateQueries(["folders"]);
      queryClient.invalidateQueries(["folderTree"]);
      toast.success("Folder created successfully");
      setCreateModalOpen(false);
      createForm.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create folder");
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: UpdateFolderRequest }) =>
      foldersApi.updateFolder(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["folders"]);
        queryClient.invalidateQueries(["folderTree"]);
        toast.success("Folder updated successfully");
        setEditModalOpen(false);
        setSelectedFolder(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to update folder");
      },
    }
  );

  const deleteMutation = useMutation(
    (id: number) => foldersApi.deleteFolder(id, false),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["folders"]);
        queryClient.invalidateQueries(["folderTree"]);
        toast.success("Folder deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedFolder(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to delete folder");
      },
    }
  );

  const handleEdit = (folder: Folder) => {
    setSelectedFolder(folder);
    editForm.reset({
      name: folder.name,
      description: folder.description || "",
      isPublic: folder.isPublic,
      metadata: folder.metadata || {},
    });
    setEditModalOpen(true);
  };

  const handleDelete = (folder: Folder) => {
    setSelectedFolder(folder);
    setDeleteDialogOpen(true);
  };

  const handleOpenFolder = (folder: Folder) => {
    setCurrentFolderId(folder.id);
  };

  const onCreateSubmit = (data: CreateFolderRequest) => {
    createMutation.mutate({
      ...data,
      parentFolderId: currentFolderId,
    });
  };

  const onEditSubmit = (data: UpdateFolderRequest) => {
    if (selectedFolder) {
      updateMutation.mutate({ id: selectedFolder.id, data });
    }
  };

  const getFolderTypeBadge = (type: FolderType) => {
    const typeMap = {
      [FolderType.General]: { label: "General", variant: "gray" as const },
      [FolderType.Images]: { label: "Images", variant: "green" as const },
      [FolderType.Documents]: { label: "Documents", variant: "blue" as const },
      [FolderType.Videos]: { label: "Videos", variant: "red" as const },
      [FolderType.Audio]: { label: "Audio", variant: "purple" as const },
      [FolderType.UserAvatars]: {
        label: "User Avatars",
        variant: "yellow" as const,
      },
      [FolderType.CompanyAssets]: {
        label: "Company Assets",
        variant: "indigo" as const,
      },
      [FolderType.Temporary]: { label: "Temporary", variant: "pink" as const },
    };

    const config = typeMap[type] || typeMap[FolderType.General];
    return (
      <Badge variant={config.variant} size="sm">
        {config.label}
      </Badge>
    );
  };

  const columns: Column<Folder>[] = [
    {
      header: "Name",
      accessor: "name",
      render: (value, item) => (
        <div className="flex items-center">
          <FolderIcon className="h-5 w-5 text-blue-500 mr-3" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {item.path}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: "folderType",
      render: (value) => getFolderTypeBadge(value),
    },
    {
      header: "Files",
      accessor: "fileCount",
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value} files
        </span>
      ),
    },
    {
      header: "Subfolders",
      accessor: "subFolderCount",
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value} folders
        </span>
      ),
    },
    {
      header: "Size",
      accessor: "totalSizeFormatted",
    },
    {
      header: "Status",
      accessor: "isPublic",
      render: (value) =>
        value ? (
          <Badge variant="green" size="sm">
            Public
          </Badge>
        ) : (
          <Badge variant="gray" size="sm">
            Private
          </Badge>
        ),
    },
    {
      header: "Created",
      accessor: "createdAt",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions = [
    {
      icon: FolderOpenIcon,
      label: "Open",
      onClick: handleOpenFolder,
      variant: "ghost" as const,
    },
    {
      icon: PencilIcon,
      label: "Edit",
      onClick: handleEdit,
      variant: "ghost" as const,
    },
    {
      icon: TrashIcon,
      label: "Delete",
      onClick: handleDelete,
      variant: "danger" as const,
    },
  ];

  const breadcrumbs = React.useMemo(() => {
    if (!currentFolderId || !folderTree) return [];

    const findPath = (
      node: any,
      targetId: number,
      path: any[] = []
    ): any[] | null => {
      if (node.id === targetId) {
        return [...path, node];
      }

      if (node.children) {
        for (const child of node.children) {
          const result = findPath(child, targetId, [...path, node]);
          if (result) return result;
        }
      }

      return null;
    };

    for (const rootNode of folderTree) {
      const path = findPath(rootNode, currentFolderId);
      if (path) return path;
    }

    return [];
  }, [currentFolderId, folderTree]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Folders Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your files in folders
          </p>
        </div>
        <Button
          leftIcon={<PlusIcon className="h-4 w-4" />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create Folder
        </Button>
      </div>

      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 0 && (
        <Card>
          <div className="p-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <button
                    onClick={() => setCurrentFolderId(undefined)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Root
                  </button>
                </li>
                {breadcrumbs.map((folder, index) => (
                  <li key={folder.id} className="flex items-center">
                    <span className="text-gray-400 mx-2">/</span>
                    <button
                      onClick={() => setCurrentFolderId(folder.id)}
                      className={`text-sm font-medium ${
                        index === breadcrumbs.length - 1
                          ? "text-gray-500 cursor-default"
                          : "text-primary-600 hover:text-primary-700"
                      }`}
                      disabled={index === breadcrumbs.length - 1}
                    >
                      {folder.name}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </Card>
      )}

      {/* Back Button */}
      {currentFolderId && (
        <div>
          <Button
            variant="outline"
            onClick={() => {
              const parentIndex = breadcrumbs.length - 2;
              if (parentIndex >= 0) {
                setCurrentFolderId(breadcrumbs[parentIndex].id);
              } else {
                setCurrentFolderId(undefined);
              }
            }}
            leftIcon={<ArrowsUpDownIcon className="h-4 w-4" />}
          >
            Back to Parent Folder
          </Button>
        </div>
      )}

      {/* Folders Table */}
      <Card padding="none">
        <DataTable
          data={folders || []}
          columns={columns}
          actions={actions}
          loading={isLoading}
          emptyMessage="No folders found"
          onRowClick={(folder) => handleOpenFolder(folder)}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Folder"
        size="lg"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={createForm.handleSubmit(onCreateSubmit)}
              loading={createMutation.isLoading}
            >
              Create Folder
            </Button>
          </div>
        }
      >
        <form
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
          className="space-y-4"
        >
          <Input
            label="Folder Name"
            {...createForm.register("name", {
              required: "Folder name is required",
            })}
            error={createForm.formState.errors.name?.message}
          />
          <Input
            label="Description (Optional)"
            {...createForm.register("description")}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Folder Type
            </label>
            <select
              {...createForm.register("folderType")}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value={FolderType.General}>General</option>
              <option value={FolderType.Images}>Images</option>
              <option value={FolderType.Documents}>Documents</option>
              <option value={FolderType.Videos}>Videos</option>
              <option value={FolderType.Audio}>Audio</option>
              <option value={FolderType.CompanyAssets}>Company Assets</option>
              <option value={FolderType.Temporary}>Temporary</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              {...createForm.register("isPublic")}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isPublic"
              className="ml-2 block text-sm text-gray-900 dark:text-white"
            >
              Make folder public
            </label>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Folder"
        size="lg"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={editForm.handleSubmit(onEditSubmit)}
              loading={updateMutation.isLoading}
            >
              Update Folder
            </Button>
          </div>
        }
      >
        <form
          onSubmit={editForm.handleSubmit(onEditSubmit)}
          className="space-y-4"
        >
          <Input
            label="Folder Name"
            {...editForm.register("name", {
              required: "Folder name is required",
            })}
            error={editForm.formState.errors.name?.message}
          />
          <Input
            label="Description (Optional)"
            {...editForm.register("description")}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="editIsPublic"
              {...editForm.register("isPublic")}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="editIsPublic"
              className="ml-2 block text-sm text-gray-900 dark:text-white"
            >
              Make folder public
            </label>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() =>
          selectedFolder && deleteMutation.mutate(selectedFolder.id)
        }
        title="Delete Folder"
        description={`Are you sure you want to delete "${selectedFolder?.name}"? This will only delete the folder, not the files inside it.`}
        confirmText="Delete"
        confirmButtonVariant="danger"
        loading={deleteMutation.isLoading}
      />
    </div>
  );
};

export default FoldersManagement;
