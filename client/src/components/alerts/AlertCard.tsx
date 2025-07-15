import React from 'react';
import { Alert } from '../../types';
import { AlertTriangle, Clock, TrendingUp } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIntensityColor = (count: number) => {
    if (count >= 5) return 'bg-red-50 border-red-200';
    if (count >= 3) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const getCountColor = (count: number) => {
    if (count >= 5) return 'text-red-600';
    if (count >= 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={`rounded-lg p-4 border ${getIntensityColor(alert.count)}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <span className="font-medium text-gray-800">{alert.field}</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className={`w-4 h-4 ${getCountColor(alert.count)}`} />
          <span className={`font-bold ${getCountColor(alert.count)}`}>
            {alert.count}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Clock className="w-3 h-3" />
        <span>{formatDate(alert.timestamp)}</span>
      </div>
      
      {alert.companyId && (
        <div className="mt-2 text-sm text-gray-500">
          Company: {alert.companyId}
        </div>
      )}
    </div>
  );
};