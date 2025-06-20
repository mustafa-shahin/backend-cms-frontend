
import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { pagesApi, usersApi, companyApi } from '../../../services/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import {
  DocumentTextIcon,
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

interface StatItem {
  name: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  color: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

const Dashboard: React.FC = () => {
  const { data: pagesData } = useQuery('pages-summary', () => pagesApi.getPages(1, 5));
  const { data: usersData } = useQuery('users-summary', () => usersApi.getUsers(1, 5));
  const { data: company } = useQuery('company', companyApi.getCompany);


  const stats: StatItem[] = [
    {
      name: 'Total Pages',
      value: pagesData?.totalCount || 0,
      icon: DocumentTextIcon,
      href: '/dashboard/pages',
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Total Users',
      value: usersData?.totalCount || 0,
      icon: UsersIcon,
      href: '/dashboard/users',
      color: 'bg-green-500',
      change: '+3%',
      changeType: 'positive',
    },
    {
      name: 'Locations',
      value: company?.locations?.length || 0,
      icon: MapPinIcon,
      href: '/dashboard/company',
      color: 'bg-purple-500',
      change: '0%',
      changeType: 'neutral',
    },
  ];

  const recentPages = pagesData?.items.slice(0, 5) || [];
  const recentUsers = usersData?.items.slice(0, 5) || [];


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to your CMS dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-md ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' 
                          ? 'text-green-600 dark:text-green-400' 
                          : stat.changeType === 'negative'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {stat.changeType === 'positive' && (
                          <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-3 w-3" />
                        )}
                        <span className="sr-only">
                          {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                        </span>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <Link to={stat.href}>
                  <Button variant="ghost" size="sm">
                    View all
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/dashboard/pages/create" className="block">
                <Button 
                  className="w-full justify-start" 
                  variant="outline" 
                  leftIcon={<PlusIcon className="h-4 w-4" />}
                >
                  Create New Page
                </Button>
              </Link>
              <Link to="/dashboard/users/create" className="block">
                <Button 
                  className="w-full justify-start" 
                  variant="outline" 
                  leftIcon={<PlusIcon className="h-4 w-4" />}
                >
                  Add New User
                </Button>
              </Link>
              <Link to="/dashboard/company" className="block">
                <Button 
                  className="w-full justify-start"
                  variant="outline" 
                  leftIcon={<BuildingOfficeIcon className="h-4 w-4" />}
                >
                  Manage Company
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Recent Pages */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Pages</h3>
            {recentPages.length ? (
              <div className="space-y-3">
                {recentPages.slice(0, 5).map((page: any) => (
                  <div key={page.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{page.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">/{page.slug}</p>
                    </div>
                    <Link to={`/dashboard/pages/${page.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No pages created yet.</p>
            )}
          </div>
        </Card>

        {/* Recent Users */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Users</h3>
            {recentUsers.length ? (
              <div className="space-y-3">
                {recentUsers.slice(0, 5).map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user.isActive ? (
                        <Badge variant="green" size="sm">Active</Badge>
                      ) : (
                        <Badge variant="gray" size="sm">Inactive</Badge>
                      )}
                      <Link to={`/dashboard/users/${user.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No users found.</p>
            )}
          </div>
        </Card>
      </div>

      {/* System Overview */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.find(s => s.name === 'Total Pages')?.value || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.find(s => s.name === 'Total Users')?.value || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {company?.locations?.length || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Company Locations</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;