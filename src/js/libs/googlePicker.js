const ACTIONS = {
  LOAD: 'LOAD',
  SHOW: 'SHOW'
};
class Picker {
  constructor(
    developerKey,
    clientId,
    appId,
    scope,
    mimeTypes
  ) {
    this.Handler = new Map();
    // Tell The Page To Load the Picker
    window.postMessage({
      type: 'FROM_EXTENSION',
      action: ACTIONS.LOAD,
      config: {
        developerKey: developerKey,
        clientId: clientId,
        appId: appId,
        scope: scope,
        mimeTypes: mimeTypes
      }
    }, '*');
    // Add Listener To Deal With Handlers
    window.addEventListener('message', (event) => {
      if (event.source != window) return;
      if (event.data.type && (event.data.type == 'FROM_PAGE')) {
        switch (event.data.action) {
          case 'CALLBACK': {
            if (this.Handler.has(event.data.id)) {
              const callback = this.Handler.get(event.data.id);
              this.Handler.delete(event.data.id);
              callback(event.data.data);
            }
            break;
          }
        }
      }
    }, false);
  }
  // Routes
  show(onClick, config={}) {
    // Generate A Request ID
    const id = Math.floor(Math.random() * Date.now());
    // Add The Request And ID into storage to be handled
    this.Handler.set(id, onClick);
    // Make Request
    window.postMessage({ type: 'FROM_EXTENSION', action: ACTIONS.SHOW, id: id, config: config }, '*');
  }
  // Handle onClick
}
export default Picker;