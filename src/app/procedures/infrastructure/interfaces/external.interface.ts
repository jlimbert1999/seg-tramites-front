export interface external {
  _id: string;
  applicant: Applicant;
  requirements: string[];
  pin: number;
  code: string;
  cite: string;
  type: string;
  account: string;
  state: string;
  reference: string;
  numberOfDocuments: string;
  send: boolean;
  group: string;
  createdAt: Date;
  updatedAt: Date;
  isSend: boolean;
}

export interface Applicant {
  firstname: string;
  middlename: string;
  lastname: string;
  phone: string;
  dni: string;
  type: 'NATURAL' | 'JURIDICO';
}
