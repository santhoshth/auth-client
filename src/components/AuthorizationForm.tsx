import React, { useState } from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import { AuthorizationResponse } from '../types';

interface AuthorizationFormProps {
  accessToken: string;
  onResult: (result: AuthorizationResponse) => void;
  onError: (error: string) => void;
  isRequesting: boolean;
  setIsRequesting: (requesting: boolean) => void;
}

export const AuthorizationForm: React.FC<AuthorizationFormProps> = ({
  accessToken,
  onResult,
  onError,
  isRequesting,
  setIsRequesting
}) => {
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/transactions');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      onError('No access token available. Please ensure you are logged in.');
      return;
    }

    setIsRequesting(true);
    onError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/authorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          method,
          path
        }),
      });

      const data = await response.json();
      console.log(data);
      
      // 200 = ALLOW, 403 = DENY - both are valid authorization responses
      if (response.status === 200 || response.status === 403) {
        onResult(data);
      } else {
        // Other status codes (401, 500, etc.) are actual errors
        throw new Error(data.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      onError(`Request failed: ${errorMessage}`);
    } finally {
      setIsRequesting(false);
    }
  };

  const commonPaths = [
    '/transactions',
    '/transactions/txn-123',
    '/accounts',
    '/accounts/acc-456',
    '/wallets',
    '/wallets/wallet-789',
    '/wallets/wallet-789/transactions',
    '/wallets/wallet-789/transactions/txn-456'
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Test Authorization</h3>
        <p className="text-sm text-gray-500 mt-1">
          Send a request to test permission checking
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-2">
            HTTP Method
          </label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="GET">GET (read)</option>
            <option value="POST">POST (write)</option>
            <option value="PUT">PUT (write)</option>
            <option value="PATCH">PATCH (write)</option>
            <option value="DELETE">DELETE (delete)</option>
          </select>
        </div>

        <div>
          <label htmlFor="path" className="block text-sm font-medium text-gray-700 mb-2">
            Resource Path
          </label>
          <div className="relative">
            <input
              type="text"
              id="path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/transactions"
              className="block w-full p-2 rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-2">Quick select common paths:</p>
            <div className="flex flex-wrap gap-1">
              {commonPaths.map((commonPath) => (
                <button
                  key={commonPath}
                  type="button"
                  onClick={() => setPath(commonPath)}
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium transition-colors ${
                    path === commonPath
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {commonPath}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!accessToken && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please log in to get an access token before testing authorization.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isRequesting || !accessToken}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRequesting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Checking...
            </div>
          ) : (
            <div className="flex items-center">
              <Send className="h-4 w-4 mr-2" />
              Test Authorization
            </div>
          )}
        </button>
      </form>
    </div>
  );
};