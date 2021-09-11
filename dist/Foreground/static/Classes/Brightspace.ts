// TODO: Import Api Types
// TODO: Main Api
class BrightSpace {
  constructor() {
    // TODO: Get Organization URL's
    // TODO: Authenticate
    // TODO: Get API Versions
    // TODO: Initialize Sub Api's
  }
  // TODO: Fetch Override
  async _fetch(route: string, options: RequestInit={}) {
    // TODO: Error Handling
    const response = await fetch(route, options);
    return response.json();
  }
  // TODO: Routes
  async versions() {
    return await this._fetch('/api/versions');
  }
}
// TODO: Sub Api's

// TODO: Exports
export default BrightSpace;