import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { PostService } from '../../../services/post.service';
import { forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
  ],
  templateUrl: './create-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePostComponent {
  private formBuilder = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<CreatePostComponent>);
  private postService = inject(PostService);

  readonly prioritys = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
  ];

  files = signal<File[]>([]);
  form = this.formBuilder.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    priority: ['low'],
  });

  create() {
    if (this.form.invalid) return;
    forkJoin([...this.files().map((file) => this.postService.uploadFile(file))])
      .pipe(switchMap((resp) => this.postService.create(this.form.value, resp)))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  addFile(event: Event): void {
    const files = this._onInputFileSelect(event);
    if (!files) return;
    this.files.update((values) => [...files, ...values]);
  }

  removeFile(index: number) {
    this.files.update((values) => {
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
