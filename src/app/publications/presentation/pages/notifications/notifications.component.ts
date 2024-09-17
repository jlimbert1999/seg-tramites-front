import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { PublicationListComponent } from '../../components';
import { publication } from '../../../infrastructure/interfaces/publications.interface';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    PublicationListComponent,
  ],
  template: `
    <h2 mat-dialog-title>Publicaciones</h2>
    <mat-dialog-content>
      <div class="h-full overflow-scroll" #containerRef>
        <publication-list
          [containerRef]="containerRef"
          [pulications]="dialogData"
        ></publication-list>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>
        Aceptar
      </button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {
  dialogData = inject<publication[]>(MAT_DIALOG_DATA);
}
