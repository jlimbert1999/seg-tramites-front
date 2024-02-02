import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  constructor() {}

  setupSocketConnection() {
    const token = localStorage.getItem('token') ?? '';
    this.socket = io(`${environment.base_url}`, { auth: { token } });
    console.log(this.socket);
  }

  disconnect() {
    // if (this.socket) {
    //   this.socket.removeListener();
    //   this.socket.disconnect();
    // }
  }
}
