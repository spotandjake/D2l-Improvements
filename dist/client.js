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
function pickerCallback(data, pickerId) {
  if (
    data.action == google.picker.Action.PICKED ||
    data.action == google.picker.Action.CANCEL
  ) {
    window.postMessage({ type: 'FROM_PAGE', action: 'CALLBACK', id: pickerId, data: data }, '*');
  }
}
// Bridge Code
let config = {};
window.addEventListener('message', (event) => {
  if (event.source != window) return;
  if (event.data.type && (event.data.type == 'FROM_EXTENSION')) {
    switch (event.data.action) {
      case 'LOAD':
        config = event.data.config;
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
    }
  }
}, false);