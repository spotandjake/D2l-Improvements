// Import Pages
import Home from './Pages/Home.js';
import ClassStream from './Pages/ClassStream.js';
// Code
const Page = {
  // Page Enum
  HOME: 'HOME',
  // In A Classroom
  STREAM: 'STREAM',
};
class App {
  constructor() {
    // Static Values
    this.organizationURL =
      'https://bc59e98c-eabc-4d42-98e1-edfe93518966.organizations.api.brightspace.com/';
    // Values
    this.location = Page.HOME;
    this.token;
    this.data = {};
    this.uid;
    this.cid;
    this.cancel;

    this.apiVersion = {};
  }
  // Start
  async start(data) {
    this.data = data;
    this.cid = data.orgUnitId;
    // Fetch Api Version Data
    await this._apiVersion();
    // Update Cycle
    setInterval(() => this.getToken(true), 300000);
    // Determine URL location
    let page = Page.HOME;
    switch (true) {
      case /\/d2l\/home\/[^/]+$/.test(window.location.pathname):
        page = Page.STREAM;
        this.cid = window.location.pathname.replace('/d2l/home/', '');
        break;
      case window.location.pathname == '/d2l/home':
      default:
        page = Page.HOME;
        break;
    }
    // TODO: Determine Page, From URL
    this.setPage(page);
  }
  // Fetch Stuff
  async _apiVersion() {
    const response = await fetch(
      'https://durham.elearningontario.ca/d2l/api/versions/'
    );
    const res = await response.json();
    res.forEach(({ LatestVersion, ProductCode, SupportedVersions }) => {
      this.apiVersion[ProductCode] = LatestVersion;
    });
  }
  // Behind the Scenes
  async getToken(refresh = false) {
    if (refresh || !this.token) {
      const response = (await fetch(
        'https://durham.elearningontario.ca/d2l/lp/auth/oauth2/token',
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded, application/json',
            'x-csrf-token': localStorage.getItem('XSRF.Token'),
          },
          body: 'scope=*:*:*',
          method: 'POST',
        }
      )
        .then((r) => r.json())
        .catch(() => localStorage.getItem('D2L.Fetch.Tokens'))) || {
        access_token: null,
      };
      this.token = response.access_token;
      return this.token;
    } else return this.token;
  }
  // Navigation
  setPage(location) {
    const classList = document.getElementById('Content').classList;
    if (typeof this.cancel == 'function') this.cancel();
    switch (location) {
      case Page.HOME:
        this.cid = null;
        this.cancel = Home(this);
        while (classList.length > 0) {
          classList.remove(classList.item(0));
        }
        classList.add('Home');
        break;
      case Page.STREAM:
        this.cancel = ClassStream(this);
        while (classList.length > 0) {
          classList.remove(classList.item(0));
        }
        classList.add('Stream');
        break;
      default:
        console.log(`Unknown location: ${location}`);
        return;
    }
    this.location = location;
  }
}

const app = new App();

export default app;
export { Page };
