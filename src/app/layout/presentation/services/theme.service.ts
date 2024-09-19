import { effect, inject, Injectable, signal } from '@angular/core';
import { ThemeClass } from '../../domain';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  _theme = signal<ThemeClass>(this.getCurrentTheme());

  theme = this._theme.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem('theme', this._theme());
    });
  }

  changeTheme(newTheme: ThemeClass) {
    console.log(newTheme);
    this._theme.set(newTheme);
  }

  // getCurrentTheme(): ThemeClass {
  //   const theme = localStorage.getItem('theme');
  //   if (!theme) return 'azure-light';
  //   const [savedColor, savedTheme] = theme.trim().split('-');
  //   if()

  //   return this.validateThemeCookie(theme) ? theme : 'violet-dark';
  // }

  // validateThemeCookie(theme: string): theme is ThemeClass {
  //   if(typeof theme===)
  //   return THEME_CLASSES.includes(theme as ThemeClass);
  // }
}
