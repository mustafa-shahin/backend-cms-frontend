// src/pages/dashboard/UsersManagement.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { usersApi } from '../../services/api';
import { UserListItem, CreateUserRequest, UpdateUserRequest } from '../../types/user';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import DataTable, { Column } from '../../components/ui/DataTable';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const UsersManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);

  const queryClient = useQueryClient();
  const pageSize = 10;

  const { data: usersData, isLoading } = useQuery(
    ['users', currentPage, searchTerm],
    () => usersApi.getUsers(currentPage, pageSize, searchTerm),
    { keepPreviousData: true }
  );

  const createForm = useForm<CreateUserRequest>();
  const editForm = useForm<UpdateUserRequest>();

  const createMutation = useMutation(usersApi.createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User created successfully');
      setCreateModalOpen(false);
      createForm.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: UpdateUserRequest }) => usersApi.updateUser(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
        toast.success('User updated successfully');
        setEditModalOpen(false);
        setSelectedUser(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update user');
      },
    }
  );

  const deleteMutation = useMutation(usersApi.deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });

  const activateMutation = useMutation(usersApi.activateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User activated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to activate user');
    },
  });

  const deactivateMutation = useMutation(usersApi.deactivateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to deactivate user');
    },
  });

  const handleEdit = (user: UserListItem) => {
    setSelectedUser(user);
    editForm.reset({
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
    });
    setEditModalOpen(true);
  };

  const handleDelete = (user: UserListItem) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleActivationToggle = (user: UserListItem) => {
    if (user.isActive) {
      deactivateMutation.mutate(user.id);
    } else {
      activateMutation.mutate(user.id);
    }
  };

  const onCreateSubmit = (data: CreateUserRequest) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: UpdateUserRequest) => {
    if (selectedUser) {
      updateMutation.mutate({ id: selectedUser.id, data });
    }
  };

  const columns: Column<UserListItem>[] = [
    {
      header: 'User',
      accessor: 'firstName',
      render: (value, item) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {item.firstName} {item.lastName}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{item.email}</div>
        </div>
      ),
    },
    {
      header: 'Username',
      accessor: 'username',
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (value, item) => (
        <div className="flex flex-col space-y-1">
          {value ? (
            <Badge variant="green">Active</Badge>
          ) : (
            <Badge variant="red">Inactive</Badge>
          )}
          {item.isLocked && <Badge variant="yellow">Locked</Badge>}
        </div>
      ),
    },
    {
      header: 'Roles',
      accessor: 'roleNames',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.map((role: string) => (
            <Badge key={role} variant="blue" size="sm">
              {role}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      header: 'Last Login',
      accessor: 'lastLoginAt',
      render: (value) => (
        value ? new Date(value).toLocaleDateString() : 'Never'
      ),
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions = [
    {
      icon: PencilIcon,
      label: 'Edit',
      onClick: handleEdit,
      variant: 'ghost' as const,
    },
    {
      icon: CheckCircleIcon,
      label: 'Toggle Status',
      onClick: handleActivationToggle,
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system users</p>
        </div>
        <Button 
          leftIcon={<PlusIcon className="h-4 w-4" />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create User
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="p-4">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card padding="none">
        <DataTable
          data={usersData?.items || []}
          columns={columns}
          actions={actions}
          loading={isLoading}
          emptyMessage="No users found"
        />
      </Card>

      {/* Pagination */}
      {usersData && usersData.totalCount > pageSize && (
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
              disabled={currentPage >= Math.ceil(usersData.totalCount / pageSize)}
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
        title="Create New User"
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
              Create User
            </Button>
          </div>
        }
      >
        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...createForm.register('firstName', { required: 'First name is required' })}
              error={createForm.formState.errors.firstName?.message}
            />
            <Input
              label="Last Name"
              {...createForm.register('lastName', { required: 'Last name is required' })}
              error={createForm.formState.errors.lastName?.message}
            />
          </div>
          <Input
            label="Email"
            type="email"
            {...createForm.register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={createForm.formState.errors.email?.message}
          />
          <Input
            label="Username"
            {...createForm.register('username', { required: 'Username is required' })}
            error={createForm.formState.errors.username?.message}
          />
          <Input
            label="Password"
            type="password"
            {...createForm.register('password', { 
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            error={createForm.formState.errors.password?.message}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              {...createForm.register('isActive')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-white">
              Active user
            </label>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit User"
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
              Update User
            </Button>
          </div>
        }
      >
        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...editForm.register('firstName', { required: 'First name is required' })}
              error={editForm.formState.errors.firstName?.message}
            />
            <Input
              label="Last Name"
              {...editForm.register('lastName', { required: 'Last name is required' })}
              error={editForm.formState.errors.lastName?.message}
            />
          </div>
          <Input
            label="Email"
            type="email"
            {...editForm.register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={editForm.formState.errors.email?.message}
          />
          <Input
            label="Username"
            {...editForm.register('username', { required: 'Username is required' })}
            error={editForm.formState.errors.username?.message}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="editIsActive"
              {...editForm.register('isActive')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="editIsActive" className="ml-2 block text-sm text-gray-900 dark:text-white">
              Active user
            </label>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => selectedUser && deleteMutation.mutate(selectedUser.id)}
        title="Delete User"
        description={`Are you sure you want to delete "${selectedUser?.firstName} ${selectedUser?.lastName}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonVariant="danger"
        loading={deleteMutation.isLoading}
      />
    </div>
  );
};

export default UsersManagement;