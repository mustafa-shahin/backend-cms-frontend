import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';

const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Page</h1>
        <p className="text-gray-600">Edit page {id}</p>
      </div>
      <Card>
        <p>Page editing form will be implemented here</p>
      </Card>
    </div>
  );
};

export default EditPage;