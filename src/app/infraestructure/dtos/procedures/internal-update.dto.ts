interface worker {
  nombre?: string;
  cargo?: string;
}

export class UpdateInternalProcedureDto {
  static fromForm(FormProcedure: any) {
    return new UpdateInternalProcedureDto(
      {
        cite: FormProcedure['cite'],
        reference: FormProcedure['reference'],
        amount: FormProcedure['amount'],
      },
      {
        remitente: {
          nombre: FormProcedure['fullname_emitter'],
          cargo: FormProcedure['jobtitle_emitter'],
        },
        destinatario: {
          nombre: FormProcedure['fullname_receiver'],
          cargo: FormProcedure['jobtitle_receiver'],
        },
      }
    );
  }

  constructor(
    public procedure: {
      cite?: string;
      reference?: string;
      amount?: string;
    },
    public details: {
      remitente: worker;
      destinatario: worker;
    }
  ) {}
}
