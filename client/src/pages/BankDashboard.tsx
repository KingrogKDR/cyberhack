import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { TabNavigation } from '../components/TabNavigation';
import { AllUserConsent } from './consent/AllUserConsent';
import { RevokeApprovals } from './consent/RevokeApprovals';
import { BankAlerts } from './alerts/BankAlerts';
import { Users, FileText, Bell } from 'lucide-react';

export const BankDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'All User Consents', icon: <Users className="w-4 h-4" /> },
    { id: 'revoke', label: 'Revoke Requests', icon: <FileText className="w-4 h-4" /> },
    { id: 'alerts', label: 'All User Alerts', icon: <Bell className="w-4 h-4" /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <AllUserConsent />;
      case 'revoke':
        return <RevokeApprovals />;
      case 'alerts':
        return <BankAlerts />;
      default:
        return <AllUserConsent />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bank Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage user consents and monitor data access</p>
      </div>

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {renderContent()}
    </div>
  );
};