import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';
import { RevokeRequestCard } from '../../components/RevokeRequestCard';
import { revokeRequestApi } from '../../api/revokeRequests';
import { RevokeRequest } from '../../types';

export const RevokeApprovals: React.FC = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<RevokeRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRevokeRequests = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await revokeRequestApi.getRevokeRequests(token);
      setRequests(data);
    } catch (error) {
      console.error('Error fetching revoke requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevokeRequests();
  }, [token]);

  const handleApprove = async (requestId: string) => {
    if (!token) return;
    
    try {
      await revokeRequestApi.processRevokeRequest(token, requestId, 'approved');
      // Refresh the requests list
      await fetchRevokeRequests();
      alert('Revoke request approved successfully!');
    } catch (error) {
      alert('Failed to approve revoke request. Please try again.');
    }
  };

  const handleReject = async (requestId: string) => {
    if (!token) return;
    
    try {
      await revokeRequestApi.processRevokeRequest(token, requestId, 'rejected');
      // Refresh the requests list
      await fetchRevokeRequests();
      alert('Revoke request rejected successfully!');
    } catch (error) {
      alert('Failed to reject revoke request. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revoke Approvals</h1>
          <p className="text-gray-600 mt-2">Review and process consent revocation requests</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No revoke requests found.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <RevokeRequestCard
                key={request.id}
                request={request}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};