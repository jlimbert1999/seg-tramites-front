import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services';
import { PostService } from '../../../../publications/presentation/services/post.service';
import { NotificationsComponent } from '../../../../publications/presentation/pages/notifications/notifications.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full">
      <div class="grow">
        <div class="flex justify-center  items-center h-full">
          <p class="text-md sm:text-2xl">Bienvenid&#64; {{ fullname }}</p>
        </div>
      </div>
      <div class="h-auto p-2">
        <span class="block font-light">Sistema de Seguimiento de Tramites</span>
        <span class="block font-bold text-sm">Version 1.9</span>
      </div>
    </div>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainComponent implements OnInit {
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private pubicationService = inject(PostService);

  fullname = this.authService.account()?.officer.fullname;

  ngOnInit(): void {
    this._showNews();
  }

  private _showNews(): void {
    this.pubicationService.getNews().subscribe((publications) => {
      if (publications.length === 0) return;
      this.dialog.open(NotificationsComponent, {
        minWidth: '900px',
        height: '600px',
        data: publications,
      });
    });
  }
}
