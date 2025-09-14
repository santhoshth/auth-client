import React from 'react';
import { CheckCircle, XCircle, AlertCircle, User, Shield } from 'lucide-react';
import { AuthorizationResponse } from '../types';

interface ResultDisplayProps {
  result: AuthorizationResponse | null;
  isRequesting: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isRequesting }) => {
  if (isRequesting) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Authorization Result</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Checking permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Authorization Result</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p>No results yet. Submit a request to test authorization.</p>
          </div>
        </div>
      </div>
    );
  }

  const isAllowed = result.decision === 'ALLOW';

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Authorization Result</h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isAllowed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isAllowed ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                ALLOW
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-1" />
                DENY
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <User className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">User ID</p>
            <p className="text-sm text-gray-600 font-mono">{result.user_id}</p>
          </div>
        </div>

        {/* Reason */}
        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">Reason</p>
          <div className={`p-3 rounded-md ${
            isAllowed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${isAllowed ? 'text-green-800' : 'text-red-800'}`}>
              {result.reason}
            </p>
          </div>
        </div>

        {/* Matched Permissions */}
        {result.matched_permissions && result.matched_permissions.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">Matched Permissions</p>
            <div className="space-y-2">
              {result.matched_permissions.map((permission, index) => (
                <div 
                  key={index}
                  className="border rounded-md p-3 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        permission.effect === 'allow' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {permission.effect.toUpperCase()}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {permission.action}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-mono text-gray-600">
                    Resource: {permission.resource}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw Response */}
        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">Raw Response</p>
          <div className="bg-gray-50 rounded-md p-3">
            <pre className="text-xs text-gray-800 overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};