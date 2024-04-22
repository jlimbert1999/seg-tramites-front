import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SocketClient,
  communicationResponse,
} from '../../infraestructure/interfaces';
import { Communication } from '../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private onlineClientsSubject = new BehaviorSubject<SocketClient[]>([]);
  public onlineClients$ = this.onlineClientsSubject.asObservable();

  constructor() {}

  connect() {
    this.socket = io(environment.base_url, {
      auth: { token: localStorage.getItem('token') },
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }
  }

  listenClientConnection() {
    this.socket.on('listar', (clients: SocketClient[]) => {
      this.onlineClientsSubject.next(clients);
    });
  }

  listenProceduresDispatches(): Observable<Communication> {
    return new Observable((observable) => {
      this.socket.on('new-mail', (data: communicationResponse) => {
        observable.next(Communication.fromResponse(data));
      });
    });
  }

  listenCancelDispatches(): Observable<string> {
    return new Observable((observable) => {
      this.socket.on('cancel-mail', (id_mail: string) => {
        observable.next(id_mail);
      });
    });
  }

  listExpel(): Observable<string> {
    return new Observable((observable) => {
      this.socket.on('has-expel', (message: string) => {
        observable.next(message);
      });
    });
  }

  expelClient(id_account: string, message: string) {
    this.socket.emit('expel', { id_account, message });
  }

  closeOne(name: string) {
    this.socket.removeListener(name);
  }
}
