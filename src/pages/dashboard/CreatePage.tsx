import React from 'react';
import Card from '../../components/ui/Card';

const CreatePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Page</h1>
        <p className="text-gray-600">Create a new page for your website</p>
      </div>
      <Card>
        <p>Page creation form will be implemented here</p>
      </Card>
    </div>
  );
};

export default CreatePage;