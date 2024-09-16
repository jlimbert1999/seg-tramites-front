import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostService } from '../../services/post.service';
import { publication } from '../../../infrastructure/interfaces/publications.interface';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatCardModule } from '@angular/material/card';
import { PublicationCardComponent, PublicationListComponent } from '../../components';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    InfiniteScrollModule,
    PublicationCardComponent,
    PublicationListComponent
  ],
  templateUrl: './post-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PostListComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  private postService = inject(PostService);

  pulications = signal<publication[]>([]);

  items = Array.from({ length: 60 }).map((_, i) => `Item #${i}`);

  ngOnInit(): void {
    this.findAll();
  }

  create(): void {
    const dialogRef = this.dialog.open(CreatePostComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  findAll() {
    this.postService.findAll().subscribe((resp) => {
      this.pulications.set(resp);
    });
  }

  onScroll() {
    console.log('scroll');
  }
}
