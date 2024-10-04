import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

interface attachments {
  title: string;
  filename: string;
}

@Component({
  selector: 'file-upload',
  standalone: true,
  imports: [MatButtonModule, MatListModule, MatIconModule],
  template: `
    <div class="flex justify-between items-center p-2">
      <span>Archivos:</span>
      <button mat-mini-fab aria-label="Attach file" (click)="fileInput.click()">
        <mat-icon>attach_file</mat-icon>
      </button>
      <input
        #fileInput
        [hidden]="true"
        [multiple]="true"
        type="file"
        (change)="add($event)"
      />
    </div>

    <mat-list class="overflow-y-auto max-h-52">
      @for (file of files(); track $index) {
      <mat-list-item>
        <mat-icon matListItemIcon>description</mat-icon>
        <div matListItemTitle>{{ file.name }}</div>
        <div matListItemLine>
          <span class="text-orange-500">Pendiente</span>
        </div>
        <button mat-icon-button (click)="remove($index)" matListItemMeta>
          <mat-icon>delete</mat-icon>
        </button>
      </mat-list-item>
      } @for (file of attachments(); track $index) {
      <mat-list-item>
        <mat-icon matListItemIcon>description</mat-icon>
        <div matListItemTitle>{{ file.title }}</div>
        <div matListItemLine>
          <span class="text-emerald-600">Completado</span>
        </div>
        <button
          mat-icon-button
          (click)="removeAttachment($index)"
          matListItemMeta
        >
          <mat-icon>delete</mat-icon>
        </button>
      </mat-list-item>
      }
    </mat-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
  files = model.required<File[]>();
  attachments = model<attachments[]>([]);

  add(event: Event): void {
    const files = this._onInputFileSelect(event);
    this.files.update((values) => [...files, ...values]);
  }

  remove(index: number): void {
    this.files.update((values) => {
      values.splice(index, 1);
      return [...values];
    });
  }

  removeAttachment(index: number): void {
    this.attachments.update((values) => {
      values.splice(index, 1);
      return [...values];
    });
  }

  private _onInputFileSelect(event: Event): File[] {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files || inputElement.files.length === 0) return [];
    const list = inputElement.files;
    const files: File[] = [];
    for (let i = 0; i < list.length; i++) {
      files.push(list[i]);
    }
    return files;
  }
}
