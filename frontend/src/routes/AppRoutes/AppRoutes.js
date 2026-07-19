// frontend/src/routes/AppRoutes/AppRoutes.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext/AuthContext';
import { NotificationProvider } from '../../context/NotificationContext/NotificationContext';
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

// Issue Pages
import IssueBoardPage from '../../features/issues/pages/IssueBoardPage';
import IssueDetailsPage from '../../features/issues/pages/IssueDetailsPage';

// ✅ Import NotificationsPage (not the placeholder)
import NotificationsPage from '../../features/notifications/pages/NotificationsPage';

import DashboardPage from '../../features/dashboard/pages/DashboardPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
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
            
            {/* Task Routes */}
            <Route path="/projects/:projectId/tasks" element={
              <ProtectedRoute>
                <MainLayout>
                  <TaskBoardPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/projects/:projectId/tasks/:taskId" element={
              <ProtectedRoute>
                <MainLayout>
                  <TaskDetailsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Issue Routes */}
            <Route path="/projects/:projectId/issues" element={
              <ProtectedRoute>
                <MainLayout>
                  <IssueBoardPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/projects/:projectId/issues/:issueId" element={
              <ProtectedRoute>
                <MainLayout>
                  <IssueDetailsPage />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* ✅ Notification Routes - Now points to actual NotificationsPage */}
            <Route path="/notifications" element={
              <ProtectedRoute>
                <MainLayout>
                  <NotificationsPage />
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
            
            {/* Fallback - 404 */}
            <Route path="*" element={
              <ProtectedRoute>
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
              </ProtectedRoute>
            } />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;