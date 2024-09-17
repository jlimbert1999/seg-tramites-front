import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { CreatePostComponent } from '../manage-publications/create-post/create-post.component';
import { PostService } from '../../services/post.service';
import { publication } from '../../../infrastructure/interfaces/publications.interface';
import {
  PublicationCardComponent,
  PublicationListComponent,
} from '../../components';

@Component({
  selector: 'app-publication-history',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    InfiniteScrollModule,
    PublicationCardComponent,
    PublicationListComponent,
  ],
  templateUrl: './publication-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PublicationHistoryComponent implements OnInit {
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
      if (!result) return;
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
