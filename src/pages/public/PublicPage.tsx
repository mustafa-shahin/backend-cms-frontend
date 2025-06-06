import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { pagesApi } from '../../services/api';

const PublicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: page, isLoading, error } = useQuery(
    ['page', slug],
    () => pagesApi.getPageBySlug(slug!),
    {
      enabled: !!slug,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
          <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{page.title}</h1>
        {page.description && (
          <p className="text-lg text-gray-600 mb-8">{page.description}</p>
        )}
        
        {/* Render page components here */}
        <div className="space-y-6">
          {page.components.map((component) => (
            <div key={component.id} className="border p-4 rounded">
              <h3 className="font-medium">Component: {component.name}</h3>
              <p className="text-sm text-gray-500">Type: {component.type}</p>
              {/* Add component rendering logic here */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicPage;