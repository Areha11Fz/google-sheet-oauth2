// Client ID and API key from the Google Cloud Console
const CLIENT_ID = '298342505049-2ols5ik9rm203t0gpi6197qbepol76lj.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAi793WvSaPX2oO62cHjauQwRWtRmD47k0';

// Get the redirect URI from the current location
const REDIRECT_URI = window.location.origin + window.location.pathname;

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];

// Authorization scopes required by the API
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Initialize the Google API client
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('auth-button').style.visibility = 'visible';
    }
}

// Handle the auth flow
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw resp;
        }
        document.getElementById('auth-button').innerText = 'Sign Out';
        document.getElementById('auth-button').onclick = handleSignoutClick;
        document.getElementById('auth-message').innerText = 'Signed in successfully';
        document.getElementById('sheet-controls').classList.remove('hidden');
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('auth-button').innerText = 'Sign In';
        document.getElementById('auth-button').onclick = handleAuthClick;
        document.getElementById('auth-message').innerText = 'Please sign in to continue';
        document.getElementById('sheet-controls').classList.add('hidden');
        document.getElementById('result').classList.add('hidden');
    }
}
