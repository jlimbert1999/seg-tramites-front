import { transferDetails, receiver } from '../../interfaces';

interface CommunicationProps {
  id_mail?: string;
  id_procedure: string;
  attachmentQuantity: string;
  reference: string;
  internalNumber: string;
  receivers: participant[];
}
interface participant {
  cuenta: string;
  fullname: string;
  jobtitle?: string;
}
export class CreateCommunicationDto {
  id_mail?: string;
  id_procedure: string;
  attachmentQuantity: string;
  reference: string;
  internalNumber: string;
  receivers: participant[];

  static fromFormData(
    FormSend: any,
    details: transferDetails,
    receivers: receiver[]
  ) {
    const participants: participant[] = receivers.map(
      ({ id_account, officer }) => ({
        cuenta: id_account,
        fullname: officer.fullname,
        jobtitle: officer.jobtitle,
      })
    );
    return new CreateCommunicationDto({
      id_mail: details.id_mail,
      id_procedure: details.id_procedure,
      attachmentQuantity: FormSend['cantidad'],
      reference: FormSend['motivo'],
      internalNumber: FormSend['numero_interno'],
      receivers: participants,
    });
  }

  constructor({
    id_mail,
    id_procedure,
    receivers,
    attachmentQuantity,
    internalNumber,
    reference,
  }: CommunicationProps) {
    if (id_mail) this.id_mail = id_mail;
    this.id_procedure = id_procedure;
    this.attachmentQuantity = attachmentQuantity;
    this.reference = reference;
    this.internalNumber = internalNumber;
    this.receivers = receivers;
  }
}
