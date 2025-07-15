import React from 'react';
import { Consent } from '../../types';
import { ConsentCard } from './ConsentCard';

interface ConsentTableProps {
  consents: Consent[];
  loading: boolean;
  onRevoke?: (consentId: string) => void;
  showRevokeButton?: boolean;
}

export const ConsentTable: React.FC<ConsentTableProps> = ({ 
  consents, 
  loading, 
  onRevoke, 
  showRevokeButton = true 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (consents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No consents found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {consents.map((consent) => (
        <ConsentCard
          key={consent.id}
          consent={consent}
          onRevoke={onRevoke}
          showRevokeButton={showRevokeButton}
        />
      ))}
    </div>
  );
};