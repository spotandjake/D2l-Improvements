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