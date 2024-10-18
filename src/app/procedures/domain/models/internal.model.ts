import { Procedure, ProcedureProps } from './procedure.model';

interface internalProps extends ProcedureProps {
  emitter: worker;
  receiver: worker;
}

interface worker {
  fullname: string;
  jobtitle: string;
}

export class InternalProcedure extends Procedure {
  emitter: worker;
  receiver: worker;

  constructor({ emitter, receiver, ...procedureProps }: internalProps) {
    super(procedureProps);
    this.emitter = emitter;
    this.receiver = receiver;
  }
}
