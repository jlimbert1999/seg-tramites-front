import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  UserSocket,
  communicationResponse,
} from '../../infraestructure/interfaces';
import { Communication } from '../../domain/models';
import { Alert } from '../../helpers';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private onlineUsersSubject = new BehaviorSubject<UserSocket[]>([]);
  public onlineUsers$ = this.onlineUsersSubject.asObservable();
  public readonly users: UserSocket[] = [];

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

  listenUserConnection() {
    this.socket.on('listar', (data: UserSocket[]) => {
      console.log('new users', data);
      this.onlineUsersSubject.next(data);
    });
  }

  listenProceduresDispatches(): Observable<Communication> {
    return new Observable((observable) => {
      this.socket!.on('new-mail', (data: communicationResponse) => {
        observable.next(Communication.fromResponse(data));
      });
    });
  }

  listenCancelDispatches(): Observable<string> {
    return new Observable((observable) => {
      this.socket!.on('cancel-mail', (id_mail: string) => {
        observable.next(id_mail);
      });
    });
  }

  listExpel(): Observable<string> {
    return new Observable((observable) => {
      this.socket!.on('has-expel', (message: string) => {
        observable.next(message);
      });
    });
  }

  expelClient(id_account: string, message: string) {
    this.socket.emit('expel', { id_account, message });
  }
}
