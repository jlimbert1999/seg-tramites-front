import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Officer } from '../../../../../domain/models';
import { workHistoryResponse } from '../../../../../infraestructure/interfaces';
import { OfficerService } from '../../../../services/administration/officer.service';
@Component({
  selector: 'app-work-history',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './work-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkHistoryComponent {
  isLoading = signal<boolean>(true);
  history = signal<workHistoryResponse[]>([]);

  officerService = inject(OfficerService);
  officer: Officer = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.officerService
      .getWorkHistory(this.officer._id, 0)
      .subscribe((data) => {
        this.history.set(data);
        this.isLoading.set(false);
      });
  }
}
