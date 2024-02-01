export interface roleResponse {
  _id: string;
  name: string;
  permissions: permissions[];
}
export interface permissions {
  resource: string;
  actions: string[];
}
