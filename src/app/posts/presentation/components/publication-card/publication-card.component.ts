import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { publications } from '../../../infrastructure/interfaces/publications.interface';

@Component({
  selector: 'publication-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="w-full" appearance="outlined">
      <mat-card-header>
        <img mat-card-avatar src="../../../../../assets/img/account.png" />
        <mat-card-title>Shiba Inu</mat-card-title>
        <mat-card-subtitle>Dog Breed</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <h3>{{ publication().title }}</h3>
        <p>{{ publication().content }}</p>
        <ul class="list-outside ">
          @for (item of publication().attachments; track $index) {
          <li>
            <a href="">{{ item.title }}</a>
          </li>

          }
        </ul>
      </mat-card-content>
      <mat-card-actions>
        <span class="px-2">{{
          publication().createdAt | date : 'medium'
        }}</span>
      </mat-card-actions>
    </mat-card>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationCardComponent {
  publication = input.required<publications>();
}
