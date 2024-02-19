import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  public toggleSidenav = signal<boolean>(true);
  public loading = signal<boolean>(false);
  public isDarkTheme = signal<boolean>(false);

  constructor(@Inject(DOCUMENT) private document: Document) {
    effect(() => {
      if (this.isDarkTheme()) {
        this.document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
      } else {
        this.document.body.classList.remove('dark-theme');
        localStorage.removeItem('theme');
      }
    });
    if (localStorage.getItem('theme')) this.isDarkTheme.set(true);
  }

  toggleTheme() {
    this.isDarkTheme.update((value) => !value);
  }
}
