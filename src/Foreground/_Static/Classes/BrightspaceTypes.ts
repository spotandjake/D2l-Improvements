// Composite's
export interface RichText {
  Text: string;
  Html: string | null;
}
// General
export const enum ContentType {
  Module,
  Topic,
}
export interface ObjectListPage<Type> {
  Next: string | null;
  Objects: Type[];
}
// Stream Types
export interface ContentObject {
  Structure: ContentObject[];
  ModuleStartDate: string | null;
  ModuleEndDate: string | null;
  ModuleDueDate: string | null;
  IsHidden: boolean;
  IsLocked: boolean;
  Id: number;
  Title: string;
  ShortTitle: string;
  Type: ContentType.Module;
  Description: RichText | null;
  ParentModuleId: number | null;
  Duration: number | null;
  LastModifiedDate: string | null;
}
export interface Module {
  Structure: ContentObject[];
  ModuleStartDate: string | null;
  ModuleEndDate: string | null;
  ModuleDueDate: string | null;
  IsHidden: boolean;
  IsLocked: boolean;
  Id: number;
  Title: string;
  ShortTitle: string;
  Type: ContentType.Module;
  Description: RichText | null;
  ParentModuleId: number | null;
  Duration: number | null;
  LastModifiedDate: string | null;
}
export interface Topic {
  TopicType: number;
  Url: string;
  StartDate: string | null;
  EndDate: string | null;
  DueDate: string | null;
  IsHidden: boolean;
  IsLocked: boolean;
  OpenAsExternalResource: boolean | null;
  Id: number;
  Title: string;
  ShortTitle: string;
  Type: ContentType.Topic;
  Description: RichText | null;
  ParentModuleId: number;
  ActivityId: string | null;
  Duration: number | null;
  IsExempt: boolean;
  ToolId: number | null;
  ToolItemId: number | null;
  ActivityType: number;
  GradeItemId: number | null;
  LastModifiedDate: string | null;
  Read: boolean | null;
}
export interface UserProgressData {
  ObjectId: number;
  UserId: number;
  CompletedDate: string | null;
  IsRead: boolean;
  NumVisits: number;
  TotalTime: number;
  LastVisited: string | null;
  Visited: boolean;
  Completed: boolean;
  IsExempt: boolean;
}
