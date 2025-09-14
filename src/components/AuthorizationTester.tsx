import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Shield, LogOut, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { LoginButton } from './LoginButton';
import { AuthorizationForm } from './AuthorizationForm';
import { TokenDisplay } from './TokenDisplay';
import { ResultDisplay } from './ResultDisplay';
import { AuthorizationResponse } from '../types';

export const AuthorizationTester: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState<string>('');
  const [result, setResult] = useState<AuthorizationResponse | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string>('');
  const [isTestSectionExpanded, setIsTestSectionExpanded] = useState(false);
  React.useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          setAccessToken(token);
        } catch (error) {
          console.error('Failed to get access token:', error);
          setError('Failed to get access token');
        }
      }
    };

    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Authorization Service Tester
                </h1>
                <p className="text-sm text-gray-500">Test JWT token validation and permissions</p>
              </div>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={user?.picture}
                    alt={user?.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </header>
            
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated ? (
          <div className="text-center py-16">
            <Shield className="mx-auto h-16 w-16 text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Authorization Service Tester
            </h2>
            <div className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
              <div className="space-y-3 text-sm text-left">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  JWT token validation with Auth0
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Permission checking with hierarchical resources
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Wildcard pattern support
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Detailed response with reasoning
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Token Display */}
              <div>
                <TokenDisplay accessToken={accessToken} />
              </div>

              {/* Collapsible Authorization Testing Section */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setIsTestSectionExpanded(!isTestSectionExpanded)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 rounded-t-lg transition-colors"
                >
                  <h3 className="text-lg font-medium text-gray-900">Authorization Testing</h3>
                  {isTestSectionExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                {isTestSectionExpanded && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Authorization Form */}
                      <div>
                        <AuthorizationForm
                          accessToken={accessToken}
                          onResult={setResult}
                          onError={setError}
                          isRequesting={isRequesting}
                          setIsRequesting={setIsRequesting}
                        />
                      </div>

                      {/* Result Display */}
                      <div>
                        <ResultDisplay result={result} isRequesting={isRequesting} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};