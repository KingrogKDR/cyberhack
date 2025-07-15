import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { LoginForm } from '../../components/Auth/LoginForm';
import { RegisterForm } from '../../components/Auth/RegisterForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Sign in to your account' : 'Sign up for a new account'}
            </p>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};