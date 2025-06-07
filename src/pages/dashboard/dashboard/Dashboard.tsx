import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { pagesApi, usersApi, companyApi } from '../../../services/api';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import {
  DocumentTextIcon,
  UsersIcon,
  BuildingOfficeIcon,
  PlusIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { data: pagesData } = useQuery('pages-summary', () => pagesApi.getPages(1, 5));
  const { data: usersData } = useQuery('users-summary', () => usersApi.getUsers(1, 5));
  const { data: company } = useQuery('company', companyApi.getCompany);

  const stats = [
    {
      name: 'Total Pages',
      value: pagesData?.totalCount || 0,
      icon: DocumentTextIcon,
      href: '/dashboard/pages',
      color: 'bg-blue-500',
    },
    {
      name: 'Total Users',
      value: usersData?.totalCount || 0,
      icon: UsersIcon,
      href: '/dashboard/users',
      color: 'bg-green-500',
    },
    {
      name: 'Locations',
      value: company?.locations?.length || 0,
      icon: MapPinIcon,
      href: '/dashboard/locations',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your CMS dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name} className="overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-md ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/dashboard/pages/create">
                <Button className="w-full justify-start" variant="outline" leftIcon={<PlusIcon className="h-4 w-4" />}>
                  Create New Page
                </Button>
              </Link>
              <Link to="/dashboard/users/create">
                <Button className="w-full justify-start" variant="outline" leftIcon={<PlusIcon className="h-4 w-4" />}>
                  Add New User
                </Button>
              </Link>
              <Link to="/dashboard/locations/create">
                <Button className="w-full justify-start" variant="outline" leftIcon={<PlusIcon className="h-4 w-4" />}>
                  Add New Location
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Pages</h3>
            {pagesData?.items.length ? (
              <div className="space-y-3">
                {pagesData.items.slice(0, 5).map((page: any) => (
                  <div key={page.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{page.title}</p>
                      <p className="text-xs text-gray-500">/{page.slug}</p>
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
              <p className="text-gray-500 text-sm">No pages created yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;