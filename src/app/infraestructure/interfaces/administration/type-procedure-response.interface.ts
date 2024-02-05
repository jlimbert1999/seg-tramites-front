export interface typeProcedureResponse {
  _id: string;
  nombre: string;
  segmento: string;
  requerimientos: requirement[];
  tipo: 'INTERNO' | 'EXTERNO';
  activo: boolean;
}
export interface requirement {
  nombre: string;
  activo: boolean;
}
