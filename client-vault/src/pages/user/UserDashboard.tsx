import React, { useState, useEffect, useRef } from 'react';
import { Shield, FileText, Bell, AlertTriangle } from 'lucide-react';
import { Layout } from '../../components/Layout';
import { consentApi } from '../../api/consent';
import { alertsApi } from '../../api/alerts';
import { toast } from '../../utils/toast';
import type { Consent, Alert } from '../../types';

export const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consents' | 'alerts'>('consents');
  const [consents, setConsents] = useState<Consent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  // Ref to store interval id for cleanup
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeTab === 'consents') {
      fetchConsents();
      // Clear any previous interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      fetchAlerts();
      // Set up interval to auto-refresh alerts every 3 minutes
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        fetchAlerts();
      }, 180000); // 3 minutes
    }
    // Cleanup on tab change or unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeTab]);

  const fetchConsents = async () => {
    console.log('🔄 UserDashboard - Fetching user consents');
    try {
      setLoading(true);
      const response = await consentApi.getUserConsents();
      console.log('✅ UserDashboard - Consents fetched successfully:', response.consents.length, 'consents');
      setConsents(response.consents);
    } catch (error) {
      console.error('❌ UserDashboard - Failed to fetch consents:', error);
      toast.error('Failed to fetch consents');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    console.log('🔄 UserDashboard - Fetching user alerts');
    try {
      setLoading(true);
      const alertsData = await alertsApi.getUserAlerts();
      console.log('✅ UserDashboard - Alerts fetched successfully:', alertsData.length, 'alerts');
      setAlerts(alertsData);
    } catch (error) {
      console.error('❌ UserDashboard - Failed to fetch alerts:', error);
      toast.error('Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeConsent = async (consentId: string) => {
    console.log('🔄 UserDashboard - Requesting revoke for consent:', consentId);
    try {
      await consentApi.requestRevoke(consentId);
      console.log('✅ UserDashboard - Revoke request sent successfully');
      toast.success('Revoke consent request sent');
      fetchConsents(); // Refresh the list
    } catch (error) {
      console.error('❌ UserDashboard - Failed to send revoke request:', error);
      toast.error('Failed to send revoke request');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderConsents = () => (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : consents.length === 0 ? (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No consents found</h3>
          <p className="text-gray-600">You haven't given any data sharing consents yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {consents.map((consent) => (
            <div key={consent.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{consent.appId}</h3>
                    <p className="text-sm text-gray-600">{consent.purpose}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  consent.revoked 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {consent.revoked ? 'Revoked' : 'Active'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Data Fields:</span>
                  <span className="ml-2">{consent.dataFields.join(', ')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Expires:</span>
                  <span className="ml-2">{formatDate(consent.expiresAt)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Created:</span>
                  <span className="ml-2">{formatDate(consent.createdAt)}</span>
                </div>
              </div>

              {!consent.revoked && (
                <button
                  onClick={() => handleRevokeConsent(consent.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Revoke Consent</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <button
          onClick={fetchAlerts}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.635 19.364A9 9 0 104.582 9.582" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
          <p className="text-gray-600">You don't have any alerts at the moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Field: {alert.field}</h4>
                  <p className="text-sm text-gray-600">Access Count: {alert.count}</p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(alert.timestamp)}
                  </p>
                </div>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Bell className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
              <p className="text-gray-600">Manage your data sharing permissions and alerts</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('consents')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'consents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Consents Given</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'alerts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Alert Logs</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'consents' ? renderConsents() : renderAlerts()}
          </div>
        </div>
      </div>
    </Layout>
  );
};