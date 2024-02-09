interface worker {
  nombre: string;
  cargo: string;
}

export class CreateInternalProcedureDto {
  static fromForm(FormProcedure: any) {
    return new CreateInternalProcedureDto(
      {
        segment: FormProcedure['segment'],
        type: FormProcedure['type'],
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
      segment: string;
      cite: string;
      reference: string;
      amount: string;
      type: string;
    },
    public details: {
      remitente: worker;
      destinatario: worker;
    }
  ) {}
}
