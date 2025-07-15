import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { authAPI } from '../api';
import LoadingSpinner from './LoadingSpinner';

interface EmailVerificationProps {
  onVerificationSent: (email: string) => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ onVerificationSent, onToast }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  console.log('📧 EmailVerification component rendered');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    console.log('📧 Email input changed:', newEmail);
    setEmail(newEmail);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📧 Email verification form submitted with email:', email);
    
    if (!email) return;

    console.log('📧 Starting email verification process');
    setIsLoading(true);
    try {
      console.log('📧 Calling register API...');
      await authAPI.register({ email });
      console.log('📧 Register API call successful');
      onToast('OTP sent to your email', 'success');
      console.log('📧 Calling onVerificationSent callback');
      onVerificationSent(email);
    } catch (error) {
      console.error('📧 Email verification failed:', error);
      onToast('Failed to send OTP. Please try again.', 'error');
    } finally {
      console.log('📧 Email verification process completed, setting loading to false');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Z-Pay</h1>
          <p className="text-gray-600">Secure banking made simple</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email which is linked with bank account"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                Verify My Identity
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;