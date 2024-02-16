import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import {
  UserSocket,
  communicationResponse,
} from '../../infraestructure/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { Communication } from '../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private readonly socket: Socket;
  private onlineUsersSubject: BehaviorSubject<UserSocket[]> =
    new BehaviorSubject<UserSocket[]>([]);
  public onlineUsers$ = this.onlineUsersSubject.asObservable();
  public readonly users: UserSocket[] = [];

  constructor() {
    this.socket = io(environment.base_url, {
      auth: { token: localStorage.getItem('token') ?? '' },
    });
  }
  
  listenUserConnection() {
    this.socket.on('listar', (data: UserSocket[]) => {
      this.onlineUsersSubject.next(data);
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

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }
  }
}
