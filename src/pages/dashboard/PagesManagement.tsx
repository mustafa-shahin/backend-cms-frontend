// src/pages/dashboard/PagesManagement.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { pagesApi } from '../../services/api';
import { PageListItem, CreatePageRequest, UpdatePageRequest, PageStatus } from '../../types/page';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import DataTable, { Column } from '../../components/ui/DataTable';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PagesManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageListItem | null>(null);

  const queryClient = useQueryClient();
  const pageSize = 10;

  const { data: pagesData, isLoading } = useQuery(
    ['pages', currentPage, searchTerm],
    () => pagesApi.getPages(currentPage, pageSize, searchTerm),
    { keepPreviousData: true }
  );

  const createForm = useForm<CreatePageRequest>();
  const editForm = useForm<UpdatePageRequest>();

  const createMutation = useMutation(pagesApi.createPage, {
    onSuccess: () => {
      queryClient.invalidateQueries(['pages']);
      toast.success('Page created successfully');
      setCreateModalOpen(false);
      createForm.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create page');
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: UpdatePageRequest }) => pagesApi.updatePage(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pages']);
        toast.success('Page updated successfully');
        setEditModalOpen(false);
        setSelectedPage(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update page');
      },
    }
  );

  const deleteMutation = useMutation(pagesApi.deletePage, {
    onSuccess: () => {
      queryClient.invalidateQueries(['pages']);
      toast.success('Page deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedPage(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete page');
    },
  });

  const publishMutation = useMutation(pagesApi.publishPage, {
    onSuccess: () => {
      queryClient.invalidateQueries(['pages']);
      toast.success('Page published successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to publish page');
    },
  });

  const unpublishMutation = useMutation(pagesApi.unpublishPage, {
    onSuccess: () => {
      queryClient.invalidateQueries(['pages']);
      toast.success('Page unpublished successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to unpublish page');
    },
  });

  const handleEdit = (page: PageListItem) => {
    setSelectedPage(page);
    editForm.reset({
      name: page.name,
      title: page.title,
      slug: page.slug,
      status: page.status,
    });
    setEditModalOpen(true);
  };

  const handleDelete = (page: PageListItem) => {
    setSelectedPage(page);
    setDeleteDialogOpen(true);
  };

  const handlePublishToggle = (page: PageListItem) => {
    if (page.status === PageStatus.Published) {
      unpublishMutation.mutate(page.id);
    } else {
      publishMutation.mutate(page.id);
    }
  };

  const onCreateSubmit = (data: CreatePageRequest) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: UpdatePageRequest) => {
    if (selectedPage) {
      updateMutation.mutate({ id: selectedPage.id, data });
    }
  };

  const getStatusBadge = (status: PageStatus) => {
    switch (status) {
      case PageStatus.Published:
        return <Badge variant="green">Published</Badge>;
      case PageStatus.Draft:
        return <Badge variant="yellow">Draft</Badge>;
      case PageStatus.Archived:
        return <Badge variant="gray">Archived</Badge>;
      case PageStatus.Scheduled:
        return <Badge variant="blue">Scheduled</Badge>;
      default:
        return <Badge variant="gray">Unknown</Badge>;
    }
  };

  const columns: Column<PageListItem>[] = [
    {
      header: 'Name',
      accessor: 'name',
      render: (value, item) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">/{item.slug}</div>
        </div>
      ),
    },
    {
      header: 'Title',
      accessor: 'title',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => getStatusBadge(value),
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Updated',
      accessor: 'updatedAt',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions = [
    {
      icon: EyeIcon,
      label: 'View',
      onClick: (page: PageListItem) => window.open(`/page/${page.slug}`, '_blank'),
      variant: 'ghost' as const,
    },
    {
      icon: PencilIcon,
      label: 'Edit',
      onClick: handleEdit,
      variant: 'ghost' as const,
    },
    {
      icon: DocumentCheckIcon,
      label: 'Toggle Publication',
      onClick: handlePublishToggle,
      variant: 'ghost' as const,
    },
    {
      icon: TrashIcon,
      label: 'Delete',
      onClick: handleDelete,
      variant: 'danger' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pages</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your website pages</p>
        </div>
        <Button 
          leftIcon={<PlusIcon className="h-4 w-4" />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create Page
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="p-4">
          <Input
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </Card>

      {/* Pages Table */}
      <Card padding="none">
        <DataTable
          data={pagesData?.items || []}
          columns={columns}
          actions={actions}
          loading={isLoading}
          emptyMessage="No pages found"
        />
      </Card>

      {/* Pagination */}
      {pagesData && pagesData.totalCount > pageSize && (
        <div className="flex justify-center">
          <nav className="flex space-x-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={currentPage >= Math.ceil(pagesData.totalCount / pageSize)}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </Button>
          </nav>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Page"
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
              Create Page
            </Button>
          </div>
        }
      >
        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
          <Input
            label="Page Name"
            {...createForm.register('name', { required: 'Page name is required' })}
            error={createForm.formState.errors.name?.message}
          />
          <Input
            label="Page Title"
            {...createForm.register('title', { required: 'Page title is required' })}
            error={createForm.formState.errors.title?.message}
          />
          <Input
            label="Slug"
            placeholder="page-url-slug"
            {...createForm.register('slug', { 
              required: 'Slug is required',
              pattern: {
                value: /^[a-z0-9-]+$/,
                message: 'Slug must contain only lowercase letters, numbers, and hyphens'
              }
            })}
            error={createForm.formState.errors.slug?.message}
          />
          <Input
            label="Description"
            {...createForm.register('description')}
          />
          <Input
            label="Meta Title"
            {...createForm.register('metaTitle')}
          />
          <Input
            label="Meta Description"
            {...createForm.register('metaDescription')}
          />
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Page"
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
              Update Page
            </Button>
          </div>
        }
      >
        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
          <Input
            label="Page Name"
            {...editForm.register('name', { required: 'Page name is required' })}
            error={editForm.formState.errors.name?.message}
          />
          <Input
            label="Page Title"
            {...editForm.register('title', { required: 'Page title is required' })}
            error={editForm.formState.errors.title?.message}
          />
          <Input
            label="Slug"
            {...editForm.register('slug', { 
              required: 'Slug is required',
              pattern: {
                value: /^[a-z0-9-]+$/,
                message: 'Slug must contain only lowercase letters, numbers, and hyphens'
              }
            })}
            error={editForm.formState.errors.slug?.message}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              {...editForm.register('status')}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value={PageStatus.Draft}>Draft</option>
              <option value={PageStatus.Published}>Published</option>
              <option value={PageStatus.Archived}>Archived</option>
              <option value={PageStatus.Scheduled}>Scheduled</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => selectedPage && deleteMutation.mutate(selectedPage.id)}
        title="Delete Page"
        description={`Are you sure you want to delete "${selectedPage?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonVariant="danger"
        loading={deleteMutation.isLoading}
      />
    </div>
  );
};

export default PagesManagement;