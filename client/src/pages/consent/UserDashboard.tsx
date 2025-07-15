import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useConsent } from '../../hooks/useConsent';
import { Layout } from '../../components/Layout';
import { TabNavigation } from '../../components/TabNavigation';
import { ConsentTable } from '../../components/consent/ConsentTable';
import { AlertList } from '../../components/alerts/AlertList';
import { alertsApi } from '../../api/alerts';
import { Alert } from '../../types';
import { Shield, Bell } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { token } = useAuth();
  const { consents, loading: consentsLoading, revokeConsent } = useConsent(token);
  const [activeTab, setActiveTab] = useState('consents');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);

  const tabs = [
    { id: 'consents', label: 'Consents Given', icon: <Shield className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alert Logs', icon: <Bell className="w-4 h-4" /> }
  ];

  const fetchAlerts = async () => {
    if (!token) return;
    
    try {
      setAlertsLoading(true);
      const alertsData = await alertsApi.getUserAlerts(token);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setAlertsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'alerts') {
      fetchAlerts();
    }
  }, [activeTab, token]);

  const handleRevokeConsent = async (consentId: string) => {
    try {
      await revokeConsent(consentId);
      // Show success message
      alert('Revoke consent request sent successfully!');
    } catch (error) {
      alert('Failed to revoke consent. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your data consents and view alerts</p>
        </div>

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'consents' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Consents</h2>
            <ConsentTable
              consents={consents}
              loading={consentsLoading}
              onRevoke={handleRevokeConsent}
            />
          </div>
        )}

        {activeTab === 'alerts' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Alert Logs</h2>
            <AlertList alerts={alerts} loading={alertsLoading} />
          </div>
        )}
      </div>
    </Layout>
  );
};