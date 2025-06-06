import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import PublicLayout from './components/layout/PublicLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import PagesManagement from './pages/dashboard/PagesManagement';
import CreatePage from './pages/dashboard/CreatePage';
import EditPage from './pages/dashboard/EditPage';
import UsersManagement from './pages/dashboard/UsersManagement';
import CreateUser from './pages/dashboard/CreateUser';
import EditUser from './pages/dashboard/EditUser';
import CompanySettings from './pages/dashboard/CompanySettings';
import LocationsManagement from './pages/dashboard/LocationsManagement';
import CreateLocation from './pages/dashboard/CreateLocation';
import EditLocation from './pages/dashboard/EditLocation';
import PublicPage from './pages/public/PublicPage';
import Home from './pages/public/Home';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Public Website Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/page/:slug" element={<PublicPage />} />
              </Route>

              {/* Protected Dashboard Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Pages Management */}
                  <Route path="/dashboard/pages" element={<PagesManagement />} />
                  <Route path="/dashboard/pages/create" element={<CreatePage />} />
                  <Route path="/dashboard/pages/:id/edit" element={<EditPage />} />
                  
                  {/* Users Management */}
                  <Route path="/dashboard/users" element={<UsersManagement />} />
                  <Route path="/dashboard/users/create" element={<CreateUser />} />
                  <Route path="/dashboard/users/:id/edit" element={<EditUser />} />
                  
                  {/* Company Settings */}
                  <Route path="/dashboard/company" element={<CompanySettings />} />
                  
                  {/* Locations Management */}
                  <Route path="/dashboard/locations" element={<LocationsManagement />} />
                  <Route path="/dashboard/locations/create" element={<CreateLocation />} />
                  <Route path="/dashboard/locations/:id/edit" element={<EditLocation />} />
                </Route>
              </Route>
            </Routes>
            
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'text-sm',
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;