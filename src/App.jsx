import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Board from './pages/Board';

// Protect routes that need authentication
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-background"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Redirect to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:projectId/board" element={<Board />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
