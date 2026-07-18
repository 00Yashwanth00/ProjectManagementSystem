import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext/AuthContext';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import RoleBasedRoute from '../RoleBasedRoute/RoleBasedRoute';
import MainLayout from '../../components/layout/MainLayout';
import PageWrapper from '../../components/layout/PageWrapper';

// Auth Pages
import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';

// User Pages
import AllUsersPage from '../../features/users/pages/AllUsersPage';
import UserProfilePage from '../../features/users/pages/UserProfilePage';

// Project Pages
import ProjectListPage from '../../features/projects/pages/ProjectListPage';
import ProjectDetailsPage from '../../features/projects/pages/ProjectDetailsPage';

// Task Pages
import TaskBoardPage from '../../features/tasks/pages/TaskBoardPage';
import TaskDetailsPage from '../../features/tasks/pages/TaskDetailsPage';

import DashboardPage from '../../features/dashboard/pages/DashboardPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/register" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <RegisterPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
          
          {/* Protected Routes with MainLayout */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Project Routes */}
          <Route path="/projects" element={
            <ProtectedRoute>
              <MainLayout>
                <ProjectListPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/projects/:projectId" element={
            <ProtectedRoute>
              <MainLayout>
                <ProjectDetailsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Task Routes - Nested under project */}
          <Route path="/projects/:projectId/tasks" element={
            <ProtectedRoute>
              <MainLayout>
                <TaskBoardPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* ✅ Task Details with project context */}
          <Route path="/projects/:projectId/tasks/:taskId" element={
            <ProtectedRoute>
              <MainLayout>
                <TaskDetailsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* User Routes */}
          <Route path="/users" element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <MainLayout>
                  <AllUsersPage />
                </MainLayout>
              </RoleBasedRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <MainLayout>
                <UserProfilePage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile/:userId" element={
            <ProtectedRoute>
              <MainLayout>
                <UserProfilePage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <MainLayout>
                <PageWrapper title="Notifications" subtitle="Stay updated">
                  <div className="card"><p>Notifications coming soon...</p></div>
                </PageWrapper>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Fallback */}
          <Route path="*" element={
            <MainLayout>
              <PageWrapper title="404 - Page Not Found">
                <div className="card">
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 'var(--spacing-4)' }}>
                    Go Home
                  </a>
                </div>
              </PageWrapper>
            </MainLayout>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;