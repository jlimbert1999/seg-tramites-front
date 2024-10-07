import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PostService } from '../../../publications/presentation/services/post.service';

@Component({
  selector: 'image-uploader',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <div class="flex flex-col">
      @if(url()){
      <figure class="flex justify-center items-center rounded-2xl px-4">
        <img
          [src]="url()"
          alt="Image preview"
          class="object-scale-down rounded-2xl"
        />
      </figure>
      }
      <div class="flex items-center justify-center">
        <div class="text-lg mr-4">Imagen</div>
        <div class="flex gap-x-2">
          <button
            mat-icon-button
            aria-label="Select image"
            (click)="imageInput.click()"
            matTooltip="Seleccionar imagen"
          >
            <mat-icon>image_search</mat-icon>
          </button>
          <input
            #imageInput
            [hidden]="true"
            type="file"
            [multiple]="true"
            accept="image/png, image/jpeg, image/jpg"
            (change)="select($event)"
          />
          @if(url()){
          <button
            mat-icon-button
            aria-label="Remove image"
            matTooltip="Remover imagen"
            (click)="remove()"
          >
            <mat-icon>close</mat-icon>
          </button>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploaderComponent implements OnInit {
  private postService = inject(PostService);

  preview = input<string | null | undefined>(null);
  onImageRemoved = output<void>();

  url = signal<string | null>(null);
  file = model<File>();

  ngOnInit(): void {
    if (!this.preview()) return;
    this.postService.getFile(this.preview()!).subscribe((blob) => {
      this._setImagePreview(blob);
    });
  }

  select(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    const image = inputElement.files?.[0];
    if (!image) return;
    this.file.set(image);
    this._setImagePreview(image);
  }

  remove(): void {
    this.file.set(undefined);
    this.url.set(null);
    this.onImageRemoved.emit();
  }

  private _setImagePreview(blob: Blob) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.url.set(e.target.result);
    };
    reader.readAsDataURL(blob);
  }
}
