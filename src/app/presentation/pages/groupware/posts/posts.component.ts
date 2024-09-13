import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
// import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavButtonComponent } from '../../../components';
import { MatIconModule } from '@angular/material/icon';
import { PostComponent } from './post/post.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    // InfiniteScrollModule,
    SidenavButtonComponent,
    MatToolbarModule,
    MatIconModule,
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent {
  private dialgo = inject(MatDialog);
  items = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);

  onScroll() {
    this.items.push(`Item`, `Item`, `Item`, `Item`, `Item`);
  }

  create() {
    this.dialgo.open(PostComponent);
  }
}
