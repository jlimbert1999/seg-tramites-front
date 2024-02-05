import { internalResponse } from '../../../infraestructure/interfaces';
import { Officer } from '../administration/officer.model';
import { Procedure, ProcedureProps } from './procedure.model';

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
      type: type.nombre,
      isSend: send,
      account: {
        _id: account._id,
        funcionario: account.funcionario
          ? Officer.officerFromJson(account.funcionario)
          : undefined,
      },
      ...values,
    });
  }
  constructor({ details, ...procedureProps }: InternalProps) {
    super(procedureProps);
    this.details = details;
  }

  override get applicantDetails() {
    return {
      emiter: {
        nombre: this.details.remitente.nombre,
        cargo: this.details.remitente.cargo,
      },
      receiver: {
        nombre: this.details.destinatario.nombre,
        cargo: this.details.destinatario.cargo,
      },
    };
  }
}
