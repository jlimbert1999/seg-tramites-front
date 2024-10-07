import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
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
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { forkJoin, of, switchMap } from 'rxjs';

import { attachmentProps, PostService } from '../../../services/post.service';
import { publication } from '../../../../infrastructure';
import {
  FileUploadComponent,
  ImageUploaderComponent,
} from '../../../../../shared';

interface uploadedData {
  attachments: attachmentProps[];
  image: string | null;
}
@Component({
  selector: 'app-publication-dialog',
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
    MatDatepickerModule,
    FileUploadComponent,
    ImageUploaderComponent,
  ],
  templateUrl: './publication-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class PublicationDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private postService = inject(PostService);
  private dialogRef = inject(MatDialogRef<PublicationDialogComponent>);

  readonly minDate = signal<Date | null>(new Date());
  readonly prioritys = [
    { value: 0, label: 'Baja' },
    { value: 1, label: 'Media' },
    { value: 2, label: 'Alta' },
  ];

  data?: publication = inject(MAT_DIALOG_DATA);

  attachmentsFiles = signal<File[]>([]);
  imageFile = signal<File | undefined>(undefined);

  form: FormGroup = this.formBuilder.group({
    title: [''],
    content: [''],
    priority: [1, Validators.required],
    startDate: [this.minDate, Validators.required],
    expirationDate: [null, Validators.required],
  });

  uploaded = signal<uploadedData>({
    attachments: [],
    image: null,
  });

  ngOnInit(): void {
    if (!this.data) return;
    const { image, attachments, ...props } = this.data;
    this.form.patchValue(props);
    this.uploaded.set({ attachments: [...attachments], image });
    this.minDate.set(null);
  }

  save() {
    if (this.form.invalid) return;
    const subscription = this._fileUploadTask().pipe(
      switchMap(([image, ...attachments]) =>
        this._buildSaveMethod(image?.filename ?? null, attachments)
      )
    );
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  removeImage(): void {
    this.uploaded.update((values) => {
      values.image = '';
      return { ...values };
    });
  }

  private _fileUploadTask() {
    return forkJoin([
      this.imageFile()
        ? this.postService.uploadFile(this.imageFile()!)
        : of(null),
      ...this.attachmentsFiles().map((file) =>
        this.postService.uploadFile(file)
      ),
    ]);
  }

  private _buildSaveMethod(
    image: string | null,
    attachments: attachmentProps[]
  ) {
    if (!this.data) {
      return this.postService.create(this.form.value, attachments, image);
    }
    return this.postService.update({
      id: this.data._id,
      form: this.form.value,
      attachments: [
        ...this.uploaded().attachments.map(({ filename, title }) => ({
          filename: filename.split('/').pop()!,
          title,
        })),
        ...attachments,
      ],
      image: image ?? this.uploaded().image?.split('/').pop()!,
    });
  }
}
