import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, effect, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderComponent } from '../components/loader/loader.component';

@Injectable({
  providedIn: 'root',
})
export class AppearanceService {
  public isLoading = new Subject<boolean>();
  public isDarkTheme = signal<boolean>(false);
  public isSidenavToggle = signal(true);

  private readonly overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically(),
  });

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private overlay: Overlay
  ) {
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
    if (this.overlayRef.hasAttached()) return;
    this.overlayRef.attach(new ComponentPortal(LoaderComponent));
  }

  public hideLoading(): void {
    this.overlayRef.detach();
  }
}
