export type TVisibility = 'private' | 'code' | 'public';
export type TEdit = 'host' | 'participant' | 'user' | 'everyone';
export type TSort = 'custom' | 'title' | 'time' | 'single' | 'votes';

export interface IMeetingInfo {
  id: string;
  name: string;
  visibility: TVisibility;
  edit: TEdit;
  sort: TSort;
}
