// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import DashboardLayout from './components/layout/DashboardLayout';
import PublicLayout from './components/layout/PublicLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import PagesManagement from './pages/dashboard/PagesManagement';
import UsersManagement from './pages/dashboard/UsersManagement';
import CompanySettings from './pages/dashboard/CompanySettings';
import JobsManagement from './pages/dashboard/JobsManagement';
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
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App min-h-screen bg-white dark:bg-gray-900 transition-colors">
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
                    
                    {/* Users Management */}
                    <Route path="/dashboard/users" element={<UsersManagement />} />
                    
                    {/* Company Settings (includes locations) */}
                    <Route path="/dashboard/company" element={<CompanySettings />} />
                    
                    {/* Jobs Management */}
                    <Route path="/dashboard/jobs" element={<JobsManagement />} />
                  </Route>
                </Route>
              </Routes>
              
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  className: 'text-sm',
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;