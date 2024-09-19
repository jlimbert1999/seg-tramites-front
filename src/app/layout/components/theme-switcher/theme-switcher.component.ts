import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { THEME_OPTIONS } from '../../domain';

@Component({
  selector: 'theme-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatSelectModule,
    MatButtonToggleModule,
  ],
  template: `
    <div>
      <div class="px-4 sm:px-0">
        <p class="text-base font-semibold">Estilo principal</p>
        <p class="max-w-2xl text-sm">
          Cambie el tema y color principal de sus vistas
        </p>
      </div>
      <div class="mt-6 border-t border-gray-100">
        <dl class="divide-y divide-gray-100">
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6">Tema</dt>
            <dd class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              <mat-button-toggle-group aria-label="Theme switcher">
                <mat-button-toggle value="light">
                  <mat-icon>light_mode</mat-icon>
                </mat-button-toggle>
                <mat-button-toggle value="dark">
                  <mat-icon>dark_mode</mat-icon>
                </mat-button-toggle>
              </mat-button-toggle-group>
            </dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm font-medium leading-6 ">Color</dt>
            <dd class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
              <mat-form-field>
                <mat-label>Seleccione el color</mat-label>
                <mat-select>
                  @for (theme of themeOptions; track $index) {
                  <mat-option [value]="theme.value">
                    <span
                      class="inline-flex items-center font-bold px-2 py-1 rounded-md"
                      [ngStyle]="{ 'background-color': theme.value }"
                    >
                      {{ theme.label }}
                    </span>
                  </mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent {
  // private themerService=inject()
  themeOptions = THEME_OPTIONS;
}
