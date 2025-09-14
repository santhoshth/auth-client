import React, { useState } from 'react';
import { Key, Copy, Check, Eye, EyeOff } from 'lucide-react';

interface TokenDisplayProps {
  accessToken: string;
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({ accessToken }) => {
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToken = async () => {
    if (accessToken) {
      await navigator.clipboard.writeText(accessToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateToken = (token: string) => {
    if (!token) return '';
    return `${token.substring(0, 20)}...${token.substring(token.length - 20)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Key className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Access Token</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowToken(!showToken)}
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {showToken ? (
                <>
                  <EyeOff className="h-3 w-3 mr-1" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 mr-1" />
                  Show
                </>
              )}
            </button>
            <button
              onClick={copyToken}
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        {accessToken ? (
          <div className="bg-gray-50 rounded-md p-3">
            <code className="text-xs font-mono text-gray-800 break-all">
              {showToken ? accessToken : truncateToken(accessToken)}
            </code>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            <Key className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <p>No access token available</p>
          </div>
        )}
      </div>
    </div>
  );
};