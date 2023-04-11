// Types
type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;
interface VersionProductVersions {
  ep: string;
  le: string;
  lp: string;
  lr: string;
}
interface ClassItem {
  name: string;
  imageLink?: string;
  imageInfo: string;
  startDate: string;
  endDate: string;
  href: string;
  isActive: boolean;
}
// This is the new internal brightspace api
// TODO: Switch all routes to be dynamic, this should not be ddsb only
class BrightSpace {
  private versions: undefined | VersionProductVersions;
  private classID = '';
  private userID = '';
  private token = '';
  constructor() {
    this.userID = localStorage.getItem('Session.UserId');
    setInterval(
      () =>
        window.requestIdleCallback(() => this.getToken(true), {
          timeout: 1000,
        }),
      300000
    );
  }
  // Internals
  public async getVersions(): Promise<VersionProductVersions> {
    if (this.versions == undefined) {
      // Fetch Version
      const versions = await this._fetch('/d2l/api/versions/', {
        headers: {
          authorization: undefined,
        },
      });
      const versionLog: VersionProductVersions = {
        ep: '1.0.0',
        le: '1.0.0',
        lp: '1.0.0',
        lr: '1.0.0',
      };
      //TODO: Make this typesafe
      //@ts-ignore
      versions.forEach((product) => {
        //@ts-ignore
        switch (product.ProductCode) {
          case 'ep':
            versionLog.ep = product.LatestVersion;
            break;
          case 'le':
            versionLog.le = product.LatestVersion;
            break;
          case 'lp':
            versionLog.lp = product.LatestVersion;
            break;
          case 'lr':
            versionLog.lr = product.LatestVersion;
            break;
        }
      });
      this.versions = versionLog;
    }
    return this.versions as VersionProductVersions;
  }
  private getUserID(): string {
    return this.userID;
  }
  public setClassID(classID: string) {
    this.classID = classID;
  }
  public getClassID(): string {
    return this.classID;
  }
  private async getToken(refresh = false) {
    if (refresh || this.token == '') {
      const _response = await window.fetch('/d2l/lp/auth/oauth2/token', {
        headers: {
          'content-type': 'application/x-www-form-urlencoded, application/json',
          'x-csrf-token': localStorage.getItem('XSRF.Token'),
        },
        body: 'scope=*:*:*',
        method: 'POST',
      });
      const { access_token } = await _response.json();
      this.token = access_token;
    }
    return this.token;
  }
  // TODO: Make this private
  public async _fetch(
    route: string,
    options: RequestInit = {},
    authorize = true
  ): Promise<JSONValue> {
    options.headers = {
      'content-type': 'application/x-www-form-urlencoded, application/json',
      ...options.headers,
    };
    if (authorize) {
      options.headers = {
        authorization: `Bearer ${await this.getToken()}`,
        ...options.headers,
      };
    }
    // TODO: Error Handling
    const response = await window.fetch(route, options);
    return await response.json();
  }
  // External
  public async getClassList(): Promise<ClassItem[]> {
    const Today = new Date().valueOf();
    const classList = await this._fetch(
      `https://bc59e98c-eabc-4d42-98e1-edfe93518966.enrollments.api.brightspace.com/users/${this.getUserID()}?search=&pageSize=20&embedDepth=0&sort=current&parentOrganizations=&orgUnitTypeId=3&promotePins=true&autoPinCourses=false&roles=&excludeEnded=false&excludeIndirect=false`
    );
    if (typeof classList != 'object' || Array.isArray(classList)) return [];
    if (classList.entities == undefined) return [];
    if (!Array.isArray(classList.entities)) return [];
    // Map Classes
    const classes = [];
    for (let i = 0; i < classList.entities.length; i++) {
      // Verify Link
      const classEntry = classList.entities[i];
      if (typeof classEntry != 'object' || Array.isArray(classEntry)) return [];
      if (classEntry.href == undefined) return [];
      if (typeof classEntry.href != 'string') return [];
      const classLink = classEntry.href;
      // Get Resources
      // TODO: Verify types
      const classResources = await this._fetch(classLink);
      // @ts-ignore
      const classInfo: any = await this._fetch(classResources.links[1].href);
      // Write Info
      classes.push({
        name: classInfo.properties.name,
        imageInfo: classInfo.entities[2].href,
        startDate: classInfo.properties.startDate,
        endDate: classInfo.properties.endDate,
        href: classInfo.links[0].href.replace(
          'https://bc59e98c-eabc-4d42-98e1-edfe93518966.folio.api.brightspace.com/organizations/',
          'https://durham.elearningontario.ca/d2l/home/'
        ),
        isActive: new Date(classInfo.endDate).valueOf() < Today,
      });
    }
    return classes;
  }
  public async getClassImages(classList: ClassItem[]): Promise<ClassItem[]> {
    const classes = [];
    for (let i = 0; i < classList.length; i++) {
      const classEntry = classList[i];
      // Get The Image
      const imageInfo = await window
        .fetch(classEntry.imageInfo)
        .then((res) => res.json())
        .catch(async () => {
          return await this._fetch(classEntry.imageInfo, {
            headers: {
              'content-type': undefined,
            },
          }).catch(
            () =>
              'https://blog.fluidui.com/content/images/2019/01/imageedit_1_9273372713.png'
          );
        });
      // Append Image to class
      classEntry.imageLink = imageInfo.links
        ? imageInfo.links[2].href
        : imageInfo;
      // Write Output
      classes.push(classEntry);
    }
    return classes;
  }
}
// Export
export default BrightSpace;
