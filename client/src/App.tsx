import React from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './pages/auth/AuthPage';
import { UserDashboard } from './pages/consent/UserDashboard';
import { BankDashboard } from './pages/BankDashboard';
import { Layout } from './components/Layout';

function App() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  if (user?.role === 'bank') {
    return (
      <Layout>
        <BankDashboard />
      </Layout>
    );
  }

  return <UserDashboard />;
}

export default App;