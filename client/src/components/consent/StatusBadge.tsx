import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          className: 'bg-green-100 text-green-700',
          label: 'Approved'
        };
      case 'rejected':
        return {
          icon: XCircle,
          className: 'bg-red-100 text-red-700',
          label: 'Rejected'
        };
      case 'pending':
      default:
        return {
          icon: Clock,
          className: 'bg-yellow-100 text-yellow-700',
          label: 'Pending'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};