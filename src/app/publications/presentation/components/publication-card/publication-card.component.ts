import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { publication } from '../../../infrastructure/interfaces/publications.interface';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'publication-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, CommonModule],
  template: `
    <mat-card class="w-full" appearance="outlined">
      <mat-card-header>
        <img mat-card-avatar src="/assets/img/account.png" />
        @if(publication().user.funcionario){
        <mat-card-title class="font-bold">
          <small>
            {{ publication().user.funcionario.nombre | titlecase }}
            {{ publication().user.funcionario.paterno | titlecase }}
            {{ publication().user.funcionario.materno | titlecase }}
          </small>
        </mat-card-title>

        } @else {
        <mat-card-title> Administrador </mat-card-title>
        }
      </mat-card-header>

      <mat-card-content class="p-0 m-0">
        @if( publication().title!==""){
        <p class="text-2xl font-bold">{{ publication().title }}</p>
        } @if( publication().content!==""){
        <p>{{ publication().content }}</p>
        } @if(url()){
        <figure class="flex justify-center items-center rounded-2xl">
          <img
            [src]="url()"
            alt="Image preview"
            class="rounded-2xl object-cover max-w-screen-md max-h-80"
          />
        </figure>
        }
        <ul class="list-disc px-4">
          @for (item of publication().attachments; track $index) {
          <li>
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
        <span class="px-2 mt-0">
          {{ publication().createdAt | date : 'medium' }}
        </span>
      </mat-card-actions>
    </mat-card>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationCardComponent implements OnInit {
  private postService = inject(PostService);

  publication = input.required<publication>();
  url = signal<string | null>(null);

  ngOnInit(): void {
    if (!this.publication().image) return;
    this.postService.getFile(this.publication().image!).subscribe((blob) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.url.set(e.target.result);
      };
      reader.readAsDataURL(blob);
    });
  }

  openFile(url: string): void {
    this.postService.getFile(url).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);
    });
  }
}
