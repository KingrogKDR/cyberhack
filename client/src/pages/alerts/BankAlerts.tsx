import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';
import { UserCard } from '../../components/UserCard';
import { AlertList } from '../../components/alerts/AlertList';
import { usersApi } from '../../api/users';
import { alertsApi } from '../../api/alerts';
import { User, Alert } from '../../types';
import { ArrowLeft } from 'lucide-react';

export const BankAlerts: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);

  const fetchUsers = async () => {
    if (!token) return;
    
    try {
      setUsersLoading(true);
      const response = await usersApi.getAllUsers(token);
      setUsers(response.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchUserAlerts = async (userId: string) => {
    if (!token) return;
    
    try {
      setAlertsLoading(true);
      const alertsData = await alertsApi.getBankAlerts(token, userId);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error fetching user alerts:', error);
    } finally {
      setAlertsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleUserSelect = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      await fetchUserAlerts(userId);
    }
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setAlerts([]);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {selectedUser && (
            <button
              onClick={handleBackToUsers}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Users
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedUser ? `${selectedUser.name}'s Alerts` : 'All User Alerts'}
            </h1>
            <p className="text-gray-600 mt-2">
              {selectedUser ? 'View user alert logs' : 'Select a user to view their alerts'}
            </p>
          </div>
        </div>

        {!selectedUser ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Users</h2>
            {usersLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onClick={handleUserSelect}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <AlertList alerts={alerts} loading={alertsLoading} />
          </div>
        )}
      </div>
    </Layout>
  );
};