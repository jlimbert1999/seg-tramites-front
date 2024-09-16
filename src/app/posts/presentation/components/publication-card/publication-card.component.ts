import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { publication } from '../../../infrastructure/interfaces/publications.interface';
import { PostService } from '../../services/post.service';

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
        <h4>{{ publication().title }}</h4>
        <p>{{ publication().content }}</p>
        <ul class="list-outside ">
          @for (item of publication().attachments; track $index) {
          <li class="list-disc">
            <span
              (click)="openFile(item.filename)"
              class="text-blue-500 underline cursor-pointer"
            >
              {{ item.title }}
            </span>
          </li>
          }
        </ul>
      </mat-card-content>
      <mat-card-actions>
        <span class="px-2">
          {{ publication().createdAt | date : 'medium' }}
        </span>
      </mat-card-actions>
    </mat-card>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationCardComponent {
  private postService = inject(PostService);

  publication = input.required<publication>();

  openFile(url: string): void {
    this.postService.getFile(url).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);
    });
  }
}
