import React from 'react';
import Card from '../../components/ui/Card';

const CompanySettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
        <p className="text-gray-600">Manage your company information</p>
      </div>
      <Card>
        <p>Company settings form will be implemented here</p>
      </Card>
    </div>
  );
};

export default CompanySettings;