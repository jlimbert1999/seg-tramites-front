export interface jobResponse {
  _id: string;
  nombre: string;
  superior: string | null;
  isRoot: boolean;
}
