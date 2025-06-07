// src/pages/dashboard/JobsManagement.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import DataTable, { Column } from '../../components/ui/DataTable';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { 
  PlayIcon, 
  StopIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  RocketLaunchIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Types for Jobs
interface Job {
  id: string;
  type: 'deployment' | 'template-sync';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  title: string;
  description: string;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  createdBy: string;
  metadata: Record<string, any>;
  progress?: number;
  errorMessage?: string;
}

interface CreateDeploymentJobRequest {
  version: string;
  releaseNotes: string;
  tenantId?: string;
  scheduledAt?: string;
}

interface CreateTemplateSyncJobRequest {
  masterTemplateVersion: string;
  tenantId?: string;
  scheduledAt?: string;
}

// Mock API functions (replace with real API calls)
const jobsApi = {
  getJobs: async (): Promise<Job[]> => {
    return [
      {
        id: '1',
        type: 'deployment',
        status: 'completed',
        title: 'Deploy v1.2.0',
        description: 'Global deployment of version 1.2.0 with bug fixes',
        scheduledAt: '2025-06-07T10:00:00Z',
        startedAt: '2025-06-07T10:00:00Z',
        completedAt: '2025-06-07T10:15:00Z',
        createdBy: 'Admin User',
        metadata: { version: '1.2.0', tenants: 5 },
        progress: 100
      },
      {
        id: '2',
        type: 'template-sync',
        status: 'running',
        title: 'Template Sync v2.1.0',
        description: 'Syncing templates to all tenants',
        scheduledAt: '2025-06-07T11:00:00Z',
        startedAt: '2025-06-07T11:00:00Z',
        createdBy: 'Admin User',
        metadata: { version: '2.1.0', tenants: 5 },
        progress: 60
      }
    ];
  },
  createDeploymentJob: async (data: CreateDeploymentJobRequest): Promise<Job> => {
    return Promise.resolve({
      id: Date.now().toString(),
      type: 'deployment',
      status: 'pending',
      title: `Deploy ${data.version}`,
      description: data.releaseNotes,
      scheduledAt: data.scheduledAt || new Date().toISOString(),
      createdBy: 'Current User',
      metadata: data
    });
  },
  createTemplateSyncJob: async (data: CreateTemplateSyncJobRequest): Promise<Job> => {
    return Promise.resolve({
      id: Date.now().toString(),
      type: 'template-sync',
      status: 'pending',
      title: `Template Sync ${data.masterTemplateVersion}`,
      description: `Sync templates to version ${data.masterTemplateVersion}`,
      scheduledAt: data.scheduledAt || new Date().toISOString(),
      createdBy: 'Current User',
      metadata: data
    });
  },
  cancelJob: async (jobId: string): Promise<void> => {
    return Promise.resolve();
  },
  retryJob: async (jobId: string): Promise<void> => {
    return Promise.resolve();
  }
};

const JobsManagement: React.FC = () => {
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);
  const [jobType, setJobType] = useState<'deployment' | 'template-sync'>('deployment');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery('jobs', jobsApi.getJobs);

  const deploymentForm = useForm<CreateDeploymentJobRequest>();
  const templateSyncForm = useForm<CreateTemplateSyncJobRequest>();

  const createDeploymentMutation = useMutation(jobsApi.createDeploymentJob, {
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      toast.success('Deployment job created successfully');
      setCreateJobModalOpen(false);
      deploymentForm.reset();
    },
    onError: () => {
      toast.error('Failed to create deployment job');
    },
  });

  const createTemplateSyncMutation = useMutation(jobsApi.createTemplateSyncJob, {
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      toast.success('Template sync job created successfully');
      setCreateJobModalOpen(false);
      templateSyncForm.reset();
    },
    onError: () => {
      toast.error('Failed to create template sync job');
    },
  });

  const cancelJobMutation = useMutation(jobsApi.cancelJob, {
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job cancelled successfully');
      setCancelDialogOpen(false);
      setSelectedJob(null);
    },
    onError: () => {
      toast.error('Failed to cancel job');
    },
  });

  const retryJobMutation = useMutation(jobsApi.retryJob, {
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job retry initiated');
    },
    onError: () => {
      toast.error('Failed to retry job');
    },
  });

  const handleCreateJob = (type: 'deployment' | 'template-sync') => {
    setJobType(type);
    setCreateJobModalOpen(true);
  };

  const handleCancelJob = (job: Job) => {
    setSelectedJob(job);
    setCancelDialogOpen(true);
  };

  const handleRetryJob = (job: Job) => {
    retryJobMutation.mutate(job.id);
  };

  const onCreateDeploymentSubmit = (data: CreateDeploymentJobRequest) => {
    createDeploymentMutation.mutate(data);
  };

  const onCreateTemplateSyncSubmit = (data: CreateTemplateSyncJobRequest) => {
    createTemplateSyncMutation.mutate(data);
  };

  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="yellow" className="flex items-center gap-1">
          <ClockIcon className="h-3 w-3" />
          Pending
        </Badge>;
      case 'running':
        return <Badge variant="blue" className="flex items-center gap-1">
          <PlayIcon className="h-3 w-3" />
          Running
        </Badge>;
      case 'completed':
        return <Badge variant="green" className="flex items-center gap-1">
          <CheckCircleIcon className="h-3 w-3" />
          Completed
        </Badge>;
      case 'failed':
        return <Badge variant="red" className="flex items-center gap-1">
          <XCircleIcon className="h-3 w-3" />
          Failed
        </Badge>;
      case 'cancelled':
        return <Badge variant="gray" className="flex items-center gap-1">
          <StopIcon className="h-3 w-3" />
          Cancelled
        </Badge>;
      default:
        return <Badge variant="gray">Unknown</Badge>;
    }
  };

  const getJobTypeIcon = (type: Job['type']) => {
    switch (type) {
      case 'deployment':
        return <RocketLaunchIcon className="h-5 w-5 text-blue-500" />;
      case 'template-sync':
        return <ArrowPathIcon className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const columns: Column<Job>[] = [
    {
      header: 'Job',
      accessor: 'title',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          {getJobTypeIcon(item.type)}
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {item.type.replace('-', ' ')}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (value) => (
        <div className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-300">
          {value}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value, item) => (
        <div className="flex flex-col gap-1">
          {getStatusBadge(value)}
          {item.progress !== undefined && (
            <div className="w-24">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.progress}%
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Created By',
      accessor: 'createdBy',
    },
    {
      header: 'Scheduled',
      accessor: 'scheduledAt',
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      header: 'Duration',
      accessor: 'startedAt',
      render: (value, item) => {
        if (!value) return '-';
        const start = new Date(value);
        const end = item.completedAt ? new Date(item.completedAt) : new Date();
        const duration = Math.round((end.getTime() - start.getTime()) / 1000);
        return `${duration}s`;
      },
    },
  ];

  const jobActions = [
    {
      icon: ArrowPathIcon,
      label: 'Retry',
      onClick: (job: Job) => handleRetryJob(job),
      variant: 'ghost' as const,
      show: (job: Job) => job.status === 'failed',
    },
    {
      icon: StopIcon,
      label: 'Cancel',
      onClick: (job: Job) => handleCancelJob(job),
      variant: 'danger' as const,
      show: (job: Job) => job.status === 'pending' || job.status === 'running',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage deployment and template sync jobs</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            leftIcon={<RocketLaunchIcon className="h-4 w-4" />}
            onClick={() => handleCreateJob('deployment')}
          >
            New Deployment
          </Button>
          <Button 
            leftIcon={<ArrowPathIcon className="h-4 w-4" />}
            onClick={() => handleCreateJob('template-sync')}
          >
            New Template Sync
          </Button>
        </div>
      </div>

      {/* Job Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {jobs?.length || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <RocketLaunchIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Running</p>
                <p className="text-2xl font-bold text-blue-600">
                  {jobs?.filter(job => job.status === 'running').length || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <PlayIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {jobs?.filter(job => job.status === 'completed').length || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {jobs?.filter(job => job.status === 'failed').length || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card padding="none">
        <DataTable
          data={jobs || []}
          columns={columns}
          actions={jobActions}
          loading={isLoading}
          emptyMessage="No jobs found"
        />
      </Card>

      {/* Create Job Modal */}
      <Modal
        open={createJobModalOpen}
        onClose={() => setCreateJobModalOpen(false)}
        title={`Create ${jobType === 'deployment' ? 'Deployment' : 'Template Sync'} Job`}
        size="lg"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setCreateJobModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (jobType === 'deployment') {
                  deploymentForm.handleSubmit(onCreateDeploymentSubmit)();
                } else {
                  templateSyncForm.handleSubmit(onCreateTemplateSyncSubmit)();
                }
              }}
              loading={createDeploymentMutation.isLoading || createTemplateSyncMutation.isLoading}
            >
              Create Job
            </Button>
          </div>
        }
      >
        {jobType === 'deployment' ? (
          <form onSubmit={deploymentForm.handleSubmit(onCreateDeploymentSubmit)} className="space-y-4">
            <Input
              label="Version"
              placeholder="e.g., 1.2.0"
              {...deploymentForm.register('version', { required: 'Version is required' })}
              error={deploymentForm.formState.errors.version?.message}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Release Notes
              </label>
              <textarea
                {...deploymentForm.register('releaseNotes', { required: 'Release notes are required' })}
                rows={4}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Describe what's included in this deployment..."
              />
              {deploymentForm.formState.errors.releaseNotes && (
                <p className="mt-1 text-sm text-red-600">{deploymentForm.formState.errors.releaseNotes.message}</p>
              )}
            </div>

            <Input
              label="Tenant ID (Optional)"
              placeholder="Leave empty for global deployment"
              {...deploymentForm.register('tenantId')}
              helperText="Specify a tenant ID to deploy to a specific tenant only"
            />

            <Input
              label="Schedule Time (Optional)"
              type="datetime-local"
              {...deploymentForm.register('scheduledAt')}
              helperText="Leave empty to start immediately"
            />

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Deployment Warning
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <p>
                      Deployments will update all specified tenants. Make sure to test in a staging environment first.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={templateSyncForm.handleSubmit(onCreateTemplateSyncSubmit)} className="space-y-4">
            <Input
              label="Master Template Version"
              placeholder="e.g., 2.1.0"
              {...templateSyncForm.register('masterTemplateVersion', { required: 'Template version is required' })}
              error={templateSyncForm.formState.errors.masterTemplateVersion?.message}
            />

            <Input
              label="Tenant ID (Optional)"
              placeholder="Leave empty for global template sync"
              {...templateSyncForm.register('tenantId')}
              helperText="Specify a tenant ID to sync templates for a specific tenant only"
            />

            <Input
              label="Schedule Time (Optional)"
              type="datetime-local"
              {...templateSyncForm.register('scheduledAt')}
              helperText="Leave empty to start immediately"
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Template Sync Information
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    <p>
                      Template syncing will update component templates across tenants. This may affect existing pages using these templates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* Cancel Job Confirmation */}
      <ConfirmDialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={() => selectedJob && cancelJobMutation.mutate(selectedJob.id)}
        title="Cancel Job"
        description={`Are you sure you want to cancel "${selectedJob?.title}"? This action cannot be undone.`}
        confirmText="Cancel Job"
        confirmButtonVariant="danger"
        loading={cancelJobMutation.isLoading}
      />
    </div>
  );
};

export default JobsManagement;