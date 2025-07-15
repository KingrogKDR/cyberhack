import React from 'react';
import { RevokeRequest } from '../types';
import { StatusBadge } from './consent/StatusBadge';
import { Check, X, Clock } from 'lucide-react';

interface RevokeRequestCardProps {
  request: RevokeRequest;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export const RevokeRequestCard: React.FC<RevokeRequestCardProps> = ({
  request,
  onApprove,
  onReject
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {request.userName || 'Unknown User'}
          </h3>
          <p className="text-sm text-gray-600">
            App: {request.appId || 'Unknown App'}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Consent ID:</span> {request.consentId}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">User ID:</span> {request.userId}
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Clock className="w-4 h-4" />
        <span>Requested: {formatDate(request.createdAt)}</span>
      </div>

      {request.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => onApprove(request.id)}
            className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Check className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={() => onReject(request.id)}
            className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
        </div>
      )}
    </div>
  );
};