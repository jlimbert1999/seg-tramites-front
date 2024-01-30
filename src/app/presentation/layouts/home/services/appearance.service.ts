import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  public toggleSidenav = signal<boolean>(true);
  constructor() {}
}
