import { officerResponse } from '../../../infraestructure/interfaces';

export interface publication {
  _id: string;
  user: user;
  title: string;
  content: string;
  attachments: Attachment[];
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  title: string;
  filename: string;
}

export interface user {
  _id: string;
  funcionario: officerResponse;
}
