// TODO: Import Api Types
import { VersionProductVersions, D2LPRODUCT } from './BrightspaceTypes';
// TODO: Main Api
class BrightSpace {
  public version = {
    ep: '1.0.0',
    le: '1.0.0',
    lp: '1.0.0',
    lr: '1.0.0',
  };
  public cid = '';
  public token = '';
  public uid = '';
  constructor() {
    // Set Props
    this.uid = localStorage.getItem('Session.UserId');
    // Call Start
    this._start();
  }
  async _start() {
    // Get API Versions
    const versions = await this.versions();
    versions.forEach((product) => {
      if (
        product.ProductCode == D2LPRODUCT.ep ||
        product.ProductCode == D2LPRODUCT.le ||
        product.ProductCode == D2LPRODUCT.lp ||
        product.ProductCode == D2LPRODUCT.lr
      )
        this.version[product.ProductCode] = product.LatestVersion;
    });
    // Authenticate
    this._getToken(true);
    setInterval(
      () =>
        window.requestIdleCallback(() => this._getToken(true), {
          timeout: 1000,
        }),
      300000
    );
    // TODO: Initialize Sub Api's
  }
  // TODO: Fetch Override
  async _fetch(route: string, options: RequestInit = {}) {
    if (route.startsWith('/'))
      route = `https://durham.elearningontario.ca/d2l${route}`; // Testing
    options.headers = {
      'content-type': 'application/x-www-form-urlencoded, application/json',
      ...options.headers,
    };
    // TODO: Error Handling
    const response = await fetch(route, options);
    return response.json();
  }
  // TODO: Routes
  async _getToken(refresh = false) {
    if (refresh || this.token == '') {
      const response = await this._fetch('/lp/auth/oauth2/token', {
        headers: {
          'x-csrf-token': localStorage.getItem('XSRF.Token'),
        },
        body: 'scope=*:*:*',
        method: 'POST',
      });
      this.token = response.access_token;
    }
    return this.token;
  }
  async versions(): Promise<VersionProductVersions[]> {
    return await this._fetch('/api/versions/');
  }
  // Localized Methods
}
// Exports
export default BrightSpace;
