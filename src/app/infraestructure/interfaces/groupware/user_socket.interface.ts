export interface SocketClient {
  id_account: string;
  id_dependencie: string;
  officer: officer;
  socketIds: string[];
}

interface officer {
  fullname: string;
  jobtitle: string;
}
