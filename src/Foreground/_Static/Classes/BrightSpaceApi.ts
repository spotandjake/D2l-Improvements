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
export interface RichText {
  text: string;
  html: string;
}
interface FileBlock {
  fileID: number;
  fileName: string;
  fileSize: number;
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
interface NewsItem {
  itemID: number;
  isHidden: boolean;
  attachments: FileBlock[];
  title: string;
  body: RichText;
  createdBy: number | null;
  createdDate: string | null;
  lastModifiedBy: number | null;
  lastModifiedDate: string | null;
  startDate: string | null;
  endDate: string | null;
  isGlobal: boolean;
  isPublished: boolean;
  showOnlyInCourseOffering: boolean;
  isAuthorInfoShown: boolean;
}
// This is the new internal brightspace api
const logError = <a>(message: string, item: a) => {
  console.log(`[Error]: ${message}`);
  return item;
};
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
    // TODO: use logError
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
        isActive: new Date(classInfo.properties.endDate).valueOf() >= Today,
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
  public async setClassContentRead(contentId: number): Promise<void> {
    await this._fetch(
      `/d2l/api/le/unstable/${this.getClassID()}/content/topics/${contentId}/view`,
      {
        method: 'POST',
      }
    );
  }
  public async getClassNews(): Promise<NewsItem[]> {
    // Read News
    const newsResponse = await this._fetch(
      `/d2l/api/le/${(await this.getVersions()).le}/${this.getClassID()}/news/`
    );
    // Map news To Safe Item
    if (!Array.isArray(newsResponse))
      return logError('Invalid News Response', []);
    const newsItems: NewsItem[] = [];
    for (const newsItem of newsResponse) {
      // Verify Type
      if (Array.isArray(newsItem) || typeof newsItem != 'object')
        return logError('Invalid News Item', []);
      if (typeof newsItem.Id != 'number')
        return logError('Invalid News Item Id', []);
      if (typeof newsItem.IsHidden != 'boolean')
        return logError('Invalid News Item isHidden', []);
      if (!Array.isArray(newsItem.Attachments))
        return logError('Invalid News Item Attachments', []);
      for (const file of newsItem.Attachments) {
        if (typeof file != 'object' || Array.isArray(file))
          return logError('Invalid News Item Attachments File', []);
        if (typeof file.FileId != 'number')
          return logError('Invalid News Item Attachments FileId', []);
        if (typeof file.FileName != 'string')
          return logError('Invalid News Item Attachments FileName', []);
        if (typeof file.FileSize != 'number')
          return logError('Invalid News Item Attachments FileSize', []);
      }
      if (typeof newsItem.Title != 'string')
        return logError('Invalid News Item Title', []);
      if (typeof newsItem.Body != 'object' || Array.isArray(newsItem.Body))
        return logError('Invalid News Item Body', []);
      if (typeof newsItem.Body.Text != 'string')
        return logError('Invalid News Item Body Text', []);
      if (typeof newsItem.Body.Html != 'string')
        return logError('Invalid News Item Body Html', []);
      if (typeof newsItem.CreatedBy != 'number' && newsItem.CreatedBy != null)
        return logError('Invalid News Item CreatedBy', []);
      if (
        typeof newsItem.CreatedDate != 'string' &&
        newsItem.CreatedDate != null
      )
        return logError('Invalid News Item CreatedDate', []);
      if (
        typeof newsItem.LastModifiedBy != 'number' &&
        newsItem.LastModifiedBy != null
      )
        return logError('Invalid News Item lastModifiedBy', []);
      if (
        typeof newsItem.LastModifiedDate != 'string' &&
        newsItem.LastModifiedDate != null
      )
        return logError('Invalid News Item lastModifiedDate', []);
      if (typeof newsItem.StartDate != 'string' && newsItem.StartDate != null)
        return logError('Invalid News Item startDate', []);
      if (typeof newsItem.EndDate != 'string' && newsItem.EndDate != null)
        return logError('Invalid News Item endDate', []);
      if (typeof newsItem.IsGlobal != 'boolean')
        return logError('Invalid News Item isGlobal', []);
      if (typeof newsItem.IsPublished != 'boolean')
        return logError('Invalid News Item isPublished', []);
      if (typeof newsItem.ShowOnlyInCourseOfferings != 'boolean')
        return logError('Invalid News Item showOnlyInCourseOffering', []);
      if (typeof newsItem.IsAuthorInfoShown != 'boolean')
        return logError('Invalid News Item isAuthorInfoShown', []);
      // Write Type To Out
      newsItems.push({
        itemID: newsItem.Id as number,
        isHidden: newsItem.IsHidden as boolean,
        attachments: <FileBlock[]>(<unknown>newsItem.Attachments),
        title: newsItem.Title as string,
        body: {
          text: newsItem.Body.Text as string,
          html: newsItem.Body.Html as string,
        },
        createdBy: newsItem.CreatedBy as number | null,
        createdDate: newsItem.CreatedDate as string | null,
        lastModifiedBy: newsItem.LastModifiedBy as number | null,
        lastModifiedDate: newsItem.LastModifiedDate as string | null,
        startDate: newsItem.StartDate as string | null,
        endDate: newsItem.EndDate as string | null,
        isGlobal: newsItem.IsGlobal as boolean,
        isPublished: newsItem.IsPublished as boolean,
        showOnlyInCourseOffering: newsItem.ShowOnlyInCourseOfferings as boolean,
        isAuthorInfoShown: newsItem.IsAuthorInfoShown as boolean,
      });
    }
    // Return
    return newsItems;
  }
}
// Export
export default BrightSpace;
