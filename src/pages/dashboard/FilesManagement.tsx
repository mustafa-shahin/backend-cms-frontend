// src/pages/dashboard/FilesManagement.tsx
import React from 'react';
import FileManager from '../../components/files/FileManager';
import Card from '../../components/ui/Card';

const FilesManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">File Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your files and folders</p>
      </div>
      
      <Card padding="none" className="h-[calc(100vh-12rem)]">
        <FileManager />
      </Card>
    </div>
  );
};

export default FilesManagement;