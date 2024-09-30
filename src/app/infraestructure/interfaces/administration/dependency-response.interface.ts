import { institution } from "../../../administration/infrastructure";

export interface dependencyResponse {
  _id: string;
  nombre: string;
  sigla: string;
  codigo: string;
  activo: boolean;
  institucion: institution;
}
