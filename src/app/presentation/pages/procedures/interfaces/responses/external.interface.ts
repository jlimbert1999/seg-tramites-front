import { groupProcedure } from '../group-procedure.interface';
import { procedure } from './procedure.interface';

export type typeApplicant = 'NATURAL' | 'JURIDICO';

export interface externalResponse extends procedure {
  group: groupProcedure;
  details: Details;
}

interface Details {
  solicitante: applicant;
  representante?: representative;
  requirements: string[];
  pin: number;
}

interface applicant {
  nombre: string;
  telefono: string;
  tipo: typeApplicant;
  paterno?: string;
  materno?: string;
  documento?: string;
  dni?: string;
}

interface representative {
  nombre: string;
  telefono: string;
  paterno: string;
  materno: string;
  documento: string;
  dni: string;
}
