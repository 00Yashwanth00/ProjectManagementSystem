import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext/AuthContext';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import RoleBasedRoute from '../RoleBasedRoute/RoleBasedRoute';
import MainLayout from '../../components/layout/MainLayout';
import PageWrapper from '../../components/layout/PageWrapper';

// Import actual pages
import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';

// Updated placeholder pages with PageWrapper
const DashboardPage = () => (
  <PageWrapper 
    title="Dashboard" 
    subtitle="Welcome to Project Management System"
  >
    <div className="card">
      <h3>Welcome back!</h3>
      <p>You are logged in as <strong>{useAuth().user?.name}</strong> with role <strong>{useAuth().user?.role}</strong>.</p>
      <div style={{ marginTop: 'var(--spacing-4)', display: 'flex', gap: 'var(--spacing-2)' }}>
        <button className="btn btn-primary">Quick Action</button>
        <button className="btn btn-secondary">View Stats</button>
      </div>
    </div>
  </PageWrapper>
);

const ProjectListPage = () => (
  <PageWrapper 
    title="Projects" 
    subtitle="Manage your projects"
    actions={
      <>
        <button className="btn btn-primary">+ New Project</button>
      </>
    }
  >
    <div className="card">
      <p>Project list will appear here</p>
    </div>
  </PageWrapper>
);

const ProjectDetailsPage = () => (
  <PageWrapper 
    title="Project Details" 
    subtitle="View and manage project"
  >
    <div className="card">
      <p>Project details will appear here</p>
    </div>
  </PageWrapper>
);

const TaskListPage = () => (
  <PageWrapper 
    title="Tasks" 
    subtitle="Manage your tasks"
    actions={
      <>
        <button className="btn btn-primary">+ New Task</button>
      </>
    }
  >
    <div className="card">
      <p>Task list will appear here</p>
    </div>
  </PageWrapper>
);

const TaskDetailsPage = () => (
  <PageWrapper 
    title="Task Details" 
    subtitle="View and manage task"
  >
    <div className="card">
      <p>Task details will appear here</p>
    </div>
  </PageWrapper>
);

const IssueListPage = () => (
  <PageWrapper 
    title="Issues" 
    subtitle="Track and manage issues"
    actions={
      <>
        <button className="btn btn-primary">+ New Issue</button>
      </>
    }
  >
    <div className="card">
      <p>Issue list will appear here</p>
    </div>
  </PageWrapper>
);

const IssueDetailsPage = () => (
  <PageWrapper 
    title="Issue Details" 
    subtitle="View and manage issue"
  >
    <div className="card">
      <p>Issue details will appear here</p>
    </div>
  </PageWrapper>
);

const UserProfilePage = () => (
  <PageWrapper 
    title="User Profile" 
    subtitle="View and edit your profile"
  >
    <div className="card">
      <p>User profile will appear here</p>
    </div>
  </PageWrapper>
);

const AllUsersPage = () => (
  <PageWrapper 
    title="All Users" 
    subtitle="Manage system users (Admin only)"
    actions={
      <>
        <button className="btn btn-primary">+ Add User</button>
      </>
    }
  >
    <div className="card">
      <p>User list will appear here</p>
    </div>
  </PageWrapper>
);

const NotificationsPage = () => (
  <PageWrapper 
    title="Notifications" 
    subtitle="Stay updated with your activities"
  >
    <div className="card">
      <p>Notifications will appear here</p>
    </div>
  </PageWrapper>
);

// Helper to access auth in Dashboard
const useAuth = () => {
  const { useAuth: useAuthContext } = require('../../context/AuthContext/AuthContext');
  return useAuthContext();
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes - No Layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes with MainLayout */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
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
          
          <Route path="/tasks" element={
            <ProtectedRoute>
              <MainLayout>
                <TaskListPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/tasks/:taskId" element={
            <ProtectedRoute>
              <MainLayout>
                <TaskDetailsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/issues" element={
            <ProtectedRoute>
              <MainLayout>
                <IssueListPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/issues/:issueId" element={
            <ProtectedRoute>
              <MainLayout>
                <IssueDetailsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
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
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <MainLayout>
                <NotificationsPage />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
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