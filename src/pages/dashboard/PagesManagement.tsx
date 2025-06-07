import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { pagesApi } from '../../services/api';
import { PageListItem } from '../../types/page';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PagesManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<PageListItem | null>(null);

  const queryClient = useQueryClient();
  const pageSize = 10;

  const { data: pagesData, isLoading, error } = useQuery(
    ['pages', currentPage, searchTerm],
    () => pagesApi.getPages(currentPage, pageSize, searchTerm),
    {
      keepPreviousData: true,
    }
  );

  const deleteMutation = useMutation(pagesApi.deletePage, {
    onSuccess: () => {
      queryClient.invalidateQueries(['pages']);
      toast.success('Page deleted successfully');
      setDeleteDialogOpen(false);
      setPageToDelete(null);
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

  const handleDeleteClick = (page: PageListItem) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (pageToDelete) {
      deleteMutation.mutate(pageToDelete.id);
    }
  };

  const handlePublishToggle = (page: PageListItem) => {
    if (page.status === 1) { // Published
      unpublishMutation.mutate(page.id);
    } else {
      publishMutation.mutate(page.id);
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge variant="green">Published</Badge>;
      case 0:
        return <Badge variant="yellow">Draft</Badge>;
      case 2:
        return <Badge variant="gray">Archived</Badge>;
      case 3:
        return <Badge variant="blue">Scheduled</Badge>;
      default:
        return <Badge variant="gray">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Error loading pages</h3>
          <p className="text-gray-500">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-600">Manage your website pages</p>
        </div>
        <Link to="/dashboard/pages/create">
          <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
            Create Page
          </Button>
        </Link>
      </div>

      <Card>
        <div className="p-6 space-y-6">
          {/* Search */}
          <div className="max-w-md">
            <Input
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Pages Table */}
          {pagesData?.items.length ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pagesData.items.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{page.title}</div>
                          <div className="text-sm text-gray-500">/{page.slug}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(page.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(page.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/page/${page.slug}`, '_blank')}
                            leftIcon={<EyeIcon className="h-4 w-4" />}
                          >
                            View
                          </Button>
                          <Link to={`/dashboard/pages/${page.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={<PencilIcon className="h-4 w-4" />}
                            >
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant={page.status === 1 ? 'secondary' : 'primary'}
                            size="sm"
                            onClick={() => handlePublishToggle(page)}
                            loading={publishMutation.isLoading || unpublishMutation.isLoading}
                          >
                            {page.status === 1 ? 'Unpublish' : 'Publish'}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(page)}
                            leftIcon={<TrashIcon className="h-4 w-4" />}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No pages found</h3>
              <p className="text-gray-500">Get started by creating your first page.</p>
              <div className="mt-6">
                <Link to="/dashboard/pages/create">
                  <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
                    Create Page
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagesData && pagesData.totalCount > pageSize && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, pagesData.totalCount)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagesData.totalCount}</span>{' '}
                  results
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage * pageSize >= pagesData.totalCount}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Page"
        description={`Are you sure you want to delete "${pageToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonVariant="danger"
        loading={deleteMutation.isLoading}
      />
    </div>
  );
};

export default PagesManagement;