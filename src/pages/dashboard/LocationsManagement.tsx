import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { PlusIcon } from '@heroicons/react/24/outline';

const LocationsManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-600">Manage company locations</p>
        </div>
        <Link to="/dashboard/locations/create">
          <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
            Add Location
          </Button>
        </Link>
      </div>
      <Card>
        <p>Locations management table will be implemented here</p>
      </Card>
    </div>
  );
};

export default LocationsManagement;
