import React from 'react';
import Card from '../../components/ui/Card';

const CreateLocation: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Location</h1>
        <p className="text-gray-600">Add a new company location</p>
      </div>
      <Card>
        <p>Location creation form will be implemented here</p>
      </Card>
    </div>
  );
};

export default CreateLocation;