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
  funcionario: {
    nombre: string;
    paterno: string;
    materno: string;
  };
  jobtitle: string;
}
