import React from 'react';
import { User } from '../types';
import { Mail, Calendar, UserIcon } from 'lucide-react';

interface UserCardProps {
  user: User;
  onClick: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(user.id)}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Mail className="w-3 h-3" />
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Calendar className="w-3 h-3" />
        <span>Joined: {formatDate(user.createdAt)}</span>
      </div>
    </div>
  );
};