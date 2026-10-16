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

/** The auth emulator has no GIS counterpart, so only production builds sign in through GIS. */
export const isGoogleIdentityEnabled = import.meta.env.MODE === 'production';

let scriptPromise: Promise<GoogleAccounts> | null = null;

function loadGis(): Promise<GoogleAccounts> {
  if (window.google?.accounts) {
    return Promise.resolve(window.google.accounts);
  }
  scriptPromise ??= new Promise<GoogleAccounts>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GIS_SCRIPT_URL;
    script.async = true;
    script.onload = () => (window.google?.accounts ? resolve(window.google.accounts) : reject(new Error('GIS failed to initialize')));
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  }).catch((error) => {
    // Any failure allows the next call to retry with a fresh script tag.
    scriptPromise = null;
    throw error;
  });
  return scriptPromise;
}

// Load the script ahead of the click so the popup opens within the click's user activation.
export const preloadGoogleIdentity = () => {
  loadGis().catch(() => undefined);
};

type PendingRequest = {resolve: (accessToken: string) => void; reject: (error: Error) => void};

// One token client for the app lifetime; its callbacks settle whichever request is pending.
let tokenClient: TokenClient | null = null;
let pending: PendingRequest | null = null;

function settle(outcome: {accessToken: string} | {error: Error}) {
  const request = pending;
  pending = null;
  if ('accessToken' in outcome) request?.resolve(outcome.accessToken);
  else request?.reject(outcome.error);
}

function getTokenClient(accounts: GoogleAccounts, clientId: string): TokenClient {
  tokenClient ??= accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: SCOPES,
    callback: (response) =>
      settle(
        response.access_token
          ? {accessToken: response.access_token}
          : {error: new Error(response.error_description ?? response.error ?? 'Google sign-in failed')},
      ),
    error_callback: (error) => settle({error: new Error(error.message ?? error.type)}),
  });
  return tokenClient;
}

/** Opens the Google account chooser and resolves with an OAuth access token. */
export async function requestGoogleAccessToken(): Promise<string> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('VITE_GOOGLE_CLIENT_ID is not set');
  }
  const client = getTokenClient(await loadGis(), clientId);
  // A repeated click replaces the previous request instead of leaving it hanging.
  settle({error: new Error('Superseded by a newer sign-in request')});
  return new Promise((resolve, reject) => {
    pending = {resolve, reject};
    client.requestAccessToken();
  });
}
