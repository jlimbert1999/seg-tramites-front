import { institution } from "./institution.interface";

export interface dependency {
  _id: string;
  nombre: string;
  sigla: string;
  codigo: string;
  activo: boolean;
  institucion: institution;
}
