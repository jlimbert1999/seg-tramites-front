import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { PostService } from '../../../publications/presentation/services/post.service';

@Component({
  selector: 'image-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if(path()){
    <div class="flex justify-center">
      <img
        [src]="path()"
        alt="Image publications"
        class="object-scale-down h-62 w-96 rounded-lg"
      />
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageViewerComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private postService = inject(PostService);
  url = input.required<string | null>();
  path = signal<string | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => {
      console.log('destroy', this.url());
      URL.revokeObjectURL(this.url()!);
    });
    effect(() => {
      if (this.url() === null) {
        untracked(() => {
          this.path.set(null);
        });
        return;
      }
      if (this.url()?.startsWith('Blob:')) {
        untracked(() => {
          this.path.set(this.url());
        });
        return;
      }
      this.postService.getFile(this.url()!).subscribe((resp) => {
        untracked(() => {
          this.path.set(URL.createObjectURL(resp));
        });
      });
    });
  }

  ngOnInit(): void {}
}
