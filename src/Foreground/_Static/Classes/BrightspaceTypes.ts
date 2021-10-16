export const enum D2LPRODUCT {
  ep = 'ep',
  le = 'le',
  lp = 'lp',
  lr = 'lr'
}
// Version
export type D2LVERSION = string;
export interface VersionProductVersions {
  ProductCode: D2LPRODUCT;
  LatestVersion: D2LVERSION;
  SupportedVersions: D2LVERSION[];
}
// Composite's
export interface RichText {
  Text: string;
  Html: string | null;
}
// General
interface FileBlock {
  FileId: number;
  FileName: string;
  FileSize: number;
}
// Stream Types
export interface NewsItem {
  Id: number,
  IsHidden: boolean,
  Attachments: FileBlock[],
  Title: string,
  Body: RichText,
  CreatedBy: number | null,
  CreatedDate: string | null,
  LastModifiedBy: number | null,
  LastModifiedDate: string | null,
  StartDate: string | null,
  EndDate: string | null,
  IsGlobal: boolean,
  IsPublished: boolean,
  ShowOnlyInCourseOfferings: boolean,
  IsAuthorInfoShown: boolean
}