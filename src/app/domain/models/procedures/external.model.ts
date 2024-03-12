import { externalResponse } from '../../../infraestructure/interfaces';
import { OriginDetails, Procedure, ProcedureProps } from './procedure.model';

interface ExternalProps extends ProcedureProps {
  details: details;
}

interface details {
  solicitante: applicant;
  representante?: representative;
  requirements: string[];
  pin: number;
}

interface applicant {
  nombre: string;
  telefono: string;
  tipo: 'NATURAL' | 'JURIDICO';
  paterno?: string;
  materno?: string;
  documento?: string;
  dni?: string;
}

interface representative {
  nombre: string;
  telefono: string;
  paterno: string;
  materno?: string;
  documento: string;
  dni: string;
}

export class ExternalProcedure extends Procedure {
  details: details;

  static ResponseToModel({
    send,
    account,
    type,
    startDate,
    endDate,
    ...values
  }: externalResponse) {
    return new ExternalProcedure({
      isSend: send,
      type: typeof type === 'string' ? type : type.nombre,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      account:
        typeof account === 'string'
          ? { id: account }
          : {
              id: account._id,
              officer: account.funcionario
                ? {
                    fullname: `${account.funcionario.nombre} ${account.funcionario.paterno} ${account.funcionario.materno}`,
                    jobtitle: account.funcionario.cargo?.nombre,
                  }
                : undefined,
            },
      ...values,
    });
  }

  constructor({ details, ...procedureProps }: ExternalProps) {
    super(procedureProps);
    this.details = details;
  }

  get fullNameApplicant() {
    return this.details.solicitante.tipo === 'NATURAL'
      ? [
          this.details.solicitante.nombre,
          this.details.solicitante.paterno,
          this.details.solicitante.materno,
        ]
          .filter(Boolean)
          .join(' ')
      : this.details.solicitante.nombre;
  }

  get fullNameRepresentative() {
    if (!this.details.representante) return 'SIN REPRESENTANTE';
    return [
      this.details.representante.nombre,
      this.details.representante.paterno,
      this.details.representante.paterno,
    ]
      .filter(Boolean)
      .join(' ');
  }

  override originDetails(): OriginDetails {
    return {
      emitter: {
        fullname: this.fullNameApplicant,
        jobtitle: `P. ${this.details.solicitante.tipo}`,
      },
      phone: this.details.solicitante.telefono,
    };
  }
}
