import { Auth0Provider } from '@auth0/auth0-react';
import { AuthorizationTester } from './components/AuthorizationTester';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

function App() {
  if (!domain || !clientId) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-lg font-medium text-gray-900 mb-2">Configuration Missing</h1>
            <p className="text-sm text-gray-600 mb-4">
              Please set up your Auth0 environment variables:
            </p>
            <div className="bg-gray-50 rounded-md p-3 text-left text-xs font-mono text-gray-800">
              <div>VITE_AUTH0_DOMAIN=your-domain.auth0.com</div>
              <div>VITE_AUTH0_CLIENT_ID=your-client-id</div>
              <div>VITE_AUTH0_AUDIENCE=your-api-identifier</div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Copy .env.example to .env and fill in your Auth0 credentials.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: 'openid profile email',
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <AuthorizationTester />
      </div>
    </Auth0Provider>
  );
}

export default App;