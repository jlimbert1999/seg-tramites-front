import { computed, effect, Injectable, signal } from '@angular/core';
import { THEME_CLASSES, ThemeClass } from '../../domain';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _theme = signal<ThemeClass>(this.getCurrentTheme());
  theme = computed(() => this._theme());

  constructor() {
    effect(() => {
      localStorage.setItem('theme', this._theme());
    });
  }

  changeTheme(newTheme: ThemeClass) {
    this._theme.set(newTheme);
  }

  getCurrentTheme(): ThemeClass {
    const theme = localStorage.getItem('theme');
    return this.validateTheme(theme) ? theme : 'azure-light';
  }

  validateTheme(theme: string | null): theme is ThemeClass {
    return THEME_CLASSES.some((validTheme) => validTheme === theme);
  }
}
