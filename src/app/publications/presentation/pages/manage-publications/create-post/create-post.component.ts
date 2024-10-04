import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { forkJoin, of, switchMap, tap } from 'rxjs';

import { attachmentProps, PostService } from '../../../services/post.service';
import { publication } from '../../../../infrastructure';
import {
  FileUploadComponent,
  ImageViewerComponent,
} from '../../../../../shared';
import { CommonModule } from '@angular/common';

interface fileProps {
  attachments: attachmentProps[];
  image: string | null;
}
@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
    MatDatepickerModule,
    ImageViewerComponent,
    FileUploadComponent,
    ImageViewerComponent,
  ],
  templateUrl: './create-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class CreatePostComponent {
  private formBuilder = inject(FormBuilder);
  private postService = inject(PostService);
  private dialogRef = inject(MatDialogRef<CreatePostComponent>);
  data?: publication = inject(MAT_DIALOG_DATA);

  readonly minDate = new Date();
  readonly prioritys = [
    { value: 0, label: 'Baja' },
    { value: 1, label: 'Media' },
    { value: 2, label: 'Alta' },
  ];

  constructor() {
    this._loadForm();
  }

  // Files
  files = signal<File[]>([]);
  imageFile = signal<File | undefined>(undefined);

  form: FormGroup = this.formBuilder.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    priority: [1, Validators.required],
    startDate: [this.minDate, Validators.required],
    expirationDate: [, Validators.required],
  });

  uploaded = signal<fileProps>({
    attachments: [],
    image: null,
  });

  preview = signal<string | null>(null);

  create() {
    if (this.form.invalid) return;
    const fileUploadTask = forkJoin([
      this.imageFile()
        ? this.postService.uploadFile(this.imageFile()!)
        : of(null),
      ...this.files().map((file) => this.postService.uploadFile(file)),
    ]);

    fileUploadTask
      .pipe(
        switchMap(([image, ...attachments]) =>
          this.data
            ? this.postService.updated({
                id: this.data._id,
                form: this.form.value,
                attachments: [
                  ...this.uploaded().attachments.map(({ filename, title }) => ({
                    filename: filename.split('/').pop() ?? '',
                    title,
                  })),
                  ...attachments,
                ],
                image: image ? image.filename : this.uploaded().image,
              })
            : this.postService.create(
                this.form.value,
                attachments,
                image?.filename
              )
        )
      )
      .subscribe((resp) => {
        this.dialogRef.close(resp);
      });
  }

  selectImage(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const image = inputElement.files?.[0];
    if (!image) return;
    this.imageFile.set(image);
    this.preview.update((valu) => {
      if (valu?.startsWith('blob:')) URL.revokeObjectURL(valu);
      console.log(valu);
      return URL.createObjectURL(image);
    });
  }

  removeImage(): void {
    this.uploaded.update((values) => {
      values.image = '';
      return { ...values };
    });
    this.preview.set(null)
  }

  private _loadForm(): void {
    if (!this.data) return;
    const { image, attachments, ...props } = this.data;
    this.form.patchValue(props);
    this.uploaded.set({ attachments: [...attachments], image });
    this.preview.set(image);
    // this.attachments.set(attachments);
    // this.image.set(image ?? undefined);
  }
}
