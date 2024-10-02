import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PublicationDialogComponent } from '../../../../publications/presentation/components';
import { PostService } from '../../../../publications/presentation/services/post.service';
import { AuthService } from '../../../services';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private publicationService = inject(PostService);

  fullname = this.authService.account()?.officer.fullname;

  ngOnInit(): void {
    this._showNews();
  }

  private _showNews(): void {
    this.publicationService.getNews().subscribe((publications) => {
      if (publications.length === 0) return;
      this.dialog.open(PublicationDialogComponent, {
        minWidth: '900px',
        height: '600px',
        data: publications,
      });
    });
  }
}
