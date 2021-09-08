// Inject Script
const script = document.createElement('script');
script.src = 'https://apis.google.com/js/api.js?key=AIzaSyCVB1GYyFHjovliBp1mphU7bJIldMu-Xaw';
document.body.appendChild(script);
// Setup
let pickerApiLoaded = false;
let oauthToken;
// Use the Google API Loader script to load the google.picker script.
function onAuthApiLoad(config) {
  window.gapi.auth.authorize(
    {
      'client_id': config.clientId,
      'scope': config.scope,
      'immediate': false
    },
    (authResult) => handleAuthResult(authResult, config)
  );
}
function onPickerApiLoad(config) {
  pickerApiLoaded = true;
  createPicker(config);
}
function handleAuthResult(authResult, config) {
  if (authResult && !authResult.error) {
    oauthToken = authResult.access_token;
    createPicker(config);
  }
}
// Create and render a Picker object for searching images.
function createPicker({ developerKey, appId, mimeTypes, pickerId }) {
  if(this.picker) {
    this.picker.setCallback((data) => pickerCallback(data, pickerId));
    this.picker.setVisible(true);
  } else if (pickerApiLoaded && oauthToken) {
    const view = new google.picker.View(google.picker.ViewId.DOCS);
    view.setMimeTypes(mimeTypes);
    const picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .setAppId(appId)
      .setOAuthToken(oauthToken)
      .addView(view)
      .addView(new google.picker.DocsUploadView())
      .setDeveloperKey(developerKey)
      .setCallback((data) => pickerCallback(data, pickerId))
      .build();
    picker.setVisible(true);
    this.picker = picker;
  }
}
async function pickerCallback(data, pickerId) {
  if (
    data.action == google.picker.Action.PICKED ||
    data.action == google.picker.Action.CANCEL
  ) {
    // Add Data for the files if the user picked something
    if (data.action == google.picker.Action.PICKED) {
      const getFile = async () => {
        if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) { // Make sure the user is signed in
          // Loop Over Each File
          data.docs = await Promise.all(data.docs.map(async (doc) => {
            // Get File Info
            const file = gapi.client.drive.files.get({
              fileId: doc.id,
              fields: 'id, name, thumbnailLink'
            });
            const fileData = await new Promise((resolve) => {
              file.execute((_fileData) => resolve(_fileData));
            });
            return {
              ...doc,
              thumbnail: fileData?.thumbnailLink || ''
            }
          }));
        } else { // Handle When User Is Not Signed In
          await gapi.auth2.getAuthInstance().signIn().catch(() => {});
          await getFile();
        }
      }
      await getFile();
    }
    window.postMessage({ type: 'FROM_PAGE', action: 'CALLBACK', id: pickerId, data: data }, '*');
  }
}
// Bridge Code
let config = {};
window.addEventListener('message', async (event) => {
  if (event.source != window) return;
  if (event.data.type && (event.data.type == 'FROM_EXTENSION')) {
    switch (event.data.action) {
      case 'LOAD':
        config = event.data.config;
        // Load Google Drive API
        window.gapi.load('client:auth2', async () => {
          await window.gapi.client.init({
            apiKey: config.developerKey,
            clientId: config.clientId,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"], //TODO: figure out what this is
            scope: 'https://www.googleapis.com/auth/drive' // TODO: make this more specific
          });
        });
        break;
      case 'SHOW': {
        const currentPickerConfig = {
          ...config,
          ...event.data.config,
          pickerId: event.data.id
        };
        // Send Messages
        window.gapi.load('auth', {'callback': () => onAuthApiLoad(currentPickerConfig)});
        window.gapi.load('picker', {'callback': () => onPickerApiLoad(currentPickerConfig)});
        break;
      }
      case 'EXPORT': {
        const data = await gapi.client.drive.files.export({
          fileId: event.data.fileId,
          mimeType: 'application/pdf'
        })
        window.postMessage({
          type: 'FROM_PAGE',
          action: 'EXPORT',
          id: event.data.id,
          data: data
        }, '*');
        break;
      }
    }
  }
}, false);