export interface internal {
  _id: string;
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
  emitter: worker;
  receiver: worker;
}

interface worker {
  fullname: string;
  jobtitle: string;
}
