import { internalResponse } from '../../../infraestructure/interfaces';
import { OriginDetails, Procedure, ProcedureProps } from './procedure.model';

interface InternalProps extends ProcedureProps {
  details: details;
}

interface details {
  remitente: worker;
  destinatario: worker;
}

interface worker {
  nombre: string;
  cargo: string;
}

export class InternalProcedure extends Procedure {
  details: details;
  static ResponseToModel({ send, type, account, ...values }: internalResponse) {
    return new InternalProcedure({
      type: typeof type === 'string' ? type : type.nombre,
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
      isSend: send,
      ...values,
    });
  }
  constructor({ details, ...procedureProps }: InternalProps) {
    super(procedureProps);
    this.details = details;
  }

  override originDetails(): OriginDetails {
    const { remitente, destinatario } = this.details;
    return {
      emitter: {
        fullname: remitente.nombre,
        jobtitle: remitente.cargo,
      },
      receiver: {
        fullname: destinatario.nombre,
        jobtitle: destinatario.cargo,
      },
    };
  }
}
