import React from 'react';
import { Alert } from '../../types';
import { AlertCard } from './AlertCard';

interface AlertListProps {
  alerts: Alert[];
  loading: boolean;
}

export const AlertList: React.FC<AlertListProps> = ({ alerts, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No alerts found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {alerts.map((alert, index) => (
        <AlertCard key={index} alert={alert} />
      ))}
    </div>
  );
};