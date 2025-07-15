import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authUtils } from './utils/auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { UserDashboard } from './pages/user/UserDashboard';
import { BankDashboard } from './pages/bank/BankDashboard';

function App() {
  const isAuthenticated = authUtils.isAuthenticated();
  const user = authUtils.getCurrentUser();


  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to={user?.role === 'bank' ? '/bank/dashboard' : '/user/dashboard'} replace />
              ) : (
                <Login />
              )
            } 
          />

          {/* User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Bank Routes */}
          <Route
            path="/bank/dashboard"
            element={
              <ProtectedRoute requiredRole="bank">
                <BankDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route 
            path="/" 
            element={
              <Navigate 
                to={
                  isAuthenticated 
                    ? (user?.role === 'bank' ? '/bank/dashboard' : '/user/dashboard')
                    : '/login'
                } 
                replace 
              />
            } 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={
              <Navigate 
                to={
                  isAuthenticated 
                    ? (user?.role === 'bank' ? '/bank/dashboard' : '/user/dashboard')
                    : '/login'
                } 
                replace 
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;