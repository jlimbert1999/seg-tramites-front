import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, effect, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  public isLoading = new Subject<boolean>();
  public isDarkTheme = signal<boolean>(false);
  public isSidenavToggle = signal(true);

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

  public showLoading(): void {
    this.isLoading.next(true);
  }

  public hideLoading(): void {
    this.isLoading.next(false);
  }
}
