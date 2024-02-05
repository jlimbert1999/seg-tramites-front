import { GroupProcedure } from '../../../domain/models';
import { procedure } from './procedure-response.interface';

export type typeApplicant = 'NATURAL' | 'JURIDICO';

export interface externalResponse extends procedure {
  group: GroupProcedure.External;
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
