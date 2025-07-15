import React from 'react';
import { Consent } from '../../types';
import { Calendar, Shield, AlertTriangle } from 'lucide-react';

interface ConsentCardProps {
  consent: Consent;
  onRevoke?: (consentId: string) => void;
  showRevokeButton?: boolean;
}

export const ConsentCard: React.FC<ConsentCardProps> = ({ 
  consent, 
  onRevoke, 
  showRevokeButton = true 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = new Date(consent.expiresAt) < new Date();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{consent.appId}</h3>
          <p className="text-sm text-gray-600 mt-1">{consent.purpose}</p>
        </div>
        {consent.revoked ? (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            Revoked
          </span>
        ) : isExpired ? (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            Expired
          </span>
        ) : (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Active
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Data Fields:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {consent.dataFields.map((field, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
            >
              {field}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>Expires: {formatDate(consent.expiresAt)}</span>
        </div>
        {isExpired && (
          <div className="flex items-center gap-1 text-yellow-600">
            <AlertTriangle className="w-4 h-4" />
            <span>Expired</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Created: {formatDate(consent.createdAt)}
        </span>
        {showRevokeButton && !consent.revoked && !isExpired && onRevoke && (
          <button
            onClick={() => onRevoke(consent.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Revoke Consent
          </button>
        )}
      </div>
    </div>
  );
};