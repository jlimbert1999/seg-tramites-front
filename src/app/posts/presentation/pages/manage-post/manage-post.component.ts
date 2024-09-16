import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PostService } from '../../services/post.service';
import { publication } from '../../../infrastructure/interfaces/publications.interface';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-manage-post',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatTableModule],
  templateUrl: './manage-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ManagePostComponent implements OnInit {
  private publicationService = inject(PostService);

  datasource = signal<publication[]>([]);
  displayedColumns: string[] = ['title', 'priority', 'attachment', 'options'];
  length = signal<number>(0);
  ngOnInit(): void {
    this.getPublications();
  }

  getPublications() {
    this.publicationService
      .findByUser()
      .subscribe(({ publications, length }) => {
        this.datasource.set(publications);
        this.length.set(length);
      });
  }
}
