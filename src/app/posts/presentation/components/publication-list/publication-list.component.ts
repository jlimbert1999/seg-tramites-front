import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PublicationCardComponent } from '../publication-card/publication-card.component';
import { PostService } from '../../services/post.service';
import { publication } from '../../../infrastructure/interfaces/publications.interface';

@Component({
  selector: 'publication-list',
  standalone: true,
  imports: [CommonModule, InfiniteScrollModule, PublicationCardComponent],
  template: `
    <div
      infiniteScroll
      [infiniteScrollDistance]="2"
      [infiniteScrollThrottle]="50"
      [infiniteScrollContainer]="containerRef()"
      (scrolled)="onScroll()"
    >
      <div class="flex flex-col gap-y-4">
        @for (pulication of pulications(); track $index) {
        <publication-card [publication]="pulication" />
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationListComponent implements OnInit {
  private postService = inject(PostService);
  pulications = signal<publication[]>([]);
  containerRef = input.required<HTMLDivElement>();

  ngOnInit(): void {
    this.loadPublications();
  }

  loadPublications(): void {
    this.postService.findAll().subscribe((resp) => {
      this.pulications.set(resp);
    });
  }

  onScroll() {
    console.log('scroll');
  }
}
