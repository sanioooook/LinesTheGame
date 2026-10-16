/**
 * Google Identity Services (GIS) sign-in.
 *
 * signInWithPopup opens the auth handler on <project>.firebaseapp.com. The app
 * itself is served from github.io, and browsers now partition third-party
 * storage, so the handler cannot read the request and fails with
 * "The requested action is invalid". GIS talks to accounts.google.com directly
 * and returns an access token, which we exchange via signInWithCredential:
 * no cross-domain storage is involved.
 */

const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';
const SCOPES = 'openid email profile';

type TokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type TokenClient = {
  requestAccessToken: () => void;
};

type GoogleAccounts = {
  oauth2: {
    initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: TokenResponse) => void;
      error_callback?: (error: {type: string; message?: string}) => void;
    }) => TokenClient;
  };
};

declare global {
  interface Window {
    google?: {accounts: GoogleAccounts};
  }
}

let scriptPromise: Promise<GoogleAccounts> | null = null;

function loadGis(): Promise<GoogleAccounts> {
  if (window.google?.accounts) {
    return Promise.resolve(window.google.accounts);
  }
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = GIS_SCRIPT_URL;
      script.async = true;
      script.onload = () =>
        window.google?.accounts ? resolve(window.google.accounts) : reject(new Error('GIS failed to initialize'));
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error('Failed to load Google Identity Services'));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

// Load the script ahead of the click so the popup opens within the click's user activation.
export const preloadGoogleIdentity = () => {
  loadGis().catch(() => undefined);
};

/** Opens the Google account chooser and resolves with an OAuth access token. */
export async function requestGoogleAccessToken(): Promise<string> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('VITE_GOOGLE_CLIENT_ID is not set');
  }
  const accounts = await loadGis();
  return new Promise((resolve, reject) => {
    const client = accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: (response) => {
        if (response.access_token) {
          resolve(response.access_token);
        } else {
          reject(new Error(response.error_description ?? response.error ?? 'Google sign-in failed'));
        }
      },
      error_callback: (error) => reject(new Error(error.message ?? error.type)),
    });
    client.requestAccessToken();
  });
}
