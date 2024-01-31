import { jobResponse } from '../../jobs/interfaces/job-response.interface';

export interface officerResponse {
  _id: string;
  nombre: string;
  paterno: string;
  materno: string;
  dni: number;
  telefono: number;
  direccion: string;
  activo: boolean;
  cuenta: boolean;
  cargo?: jobResponse;
}
