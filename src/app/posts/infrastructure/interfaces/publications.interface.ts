export interface publications {
  _id: string;
  user: string;
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
