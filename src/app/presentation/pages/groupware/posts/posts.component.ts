import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, InfiniteScrollModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent {
  items = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);

  onScroll() {
    this.items.push(`Item`, `Item`, `Item`, `Item`, `Item`);
  }
}
