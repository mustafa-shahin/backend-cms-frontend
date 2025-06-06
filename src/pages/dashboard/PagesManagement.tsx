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