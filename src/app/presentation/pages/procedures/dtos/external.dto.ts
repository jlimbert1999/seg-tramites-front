import { typeApplicant } from "../interfaces";

interface externalProperties {
  formProcedure: any;
  formApplicant: any;
  formRepresentative: any;
  requeriments: string[];
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

export class ExternalProcedureDto {
  static fromForm({ requeriments, formProcedure, formApplicant, formRepresentative }: externalProperties) {
    return new ExternalProcedureDto(
      {
        type: formProcedure['type'],
        cite: formProcedure['cite'],
        reference: formProcedure['reference'],
        amount: formProcedure['amount'],
        segment: formProcedure['segment'],
      },
      requeriments,
      formApplicant,
      Object.keys(formRepresentative).length > 0 ? formRepresentative : undefined
    );
  }
  details: {
    solicitante: {};
    representante?: representative;
    requirements: string[];
    pin: number;
  };
  constructor(
    public procedure: {
      cite: string;
      reference: string;
      amount: string;
      type: string;
      segment: string;
    },
    requirements: string[],
    applicant: applicant,
    representative?: representative
  ) {
    this.details = {
      requirements,
      solicitante: applicant,
      pin: Math.floor(100000 + Math.random() * 900000),
    };
    if (representative) this.details.representante = representative;
  }
}
