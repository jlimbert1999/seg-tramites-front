export interface roleResponse {
  _id: string;
  name: string;
  permissions: rolePermissions[];
}
export interface rolePermissions {
  resource: string;
  actions: string[];
}
