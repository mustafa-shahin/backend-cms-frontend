import React from 'react';
import Card from '../../components/ui/Card';

const CreateUser: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create User</h1>
        <p className="text-gray-600">Add a new user to the system</p>
      </div>
      <Card>
        <p>User creation form will be implemented here</p>
      </Card>
    </div>
  );
};

export default CreateUser;