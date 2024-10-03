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

import { forkJoin, of, switchMap } from 'rxjs';

import { PostService } from '../../../services/post.service';
import { publication } from '../../../../infrastructure';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
    MatDatepickerModule,
  ],
  templateUrl: './create-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class CreatePostComponent {
  private formBuilder = inject(FormBuilder);
  private postService = inject(PostService);
  private readonly dialogRef = inject(MatDialogRef<CreatePostComponent>);
  private data?: publication = inject(MAT_DIALOG_DATA);

  readonly minDate = new Date();
  readonly prioritys = [
    { value: 0, label: 'Baja' },
    { value: 1, label: 'Media' },
    { value: 2, label: 'Alta' },
  ];

  constructor() {
    this.loadForm();
  }

  files = signal<File[]>([]);
  imageFile = signal<File | undefined>(undefined);
  form: FormGroup = this.formBuilder.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    priority: [1, Validators.required],
    startDate: [this.minDate, Validators.required],
    expirationDate: [, Validators.required],
  });

  preview = signal<string | null>(null);
  isImageRemoved = signal<boolean>(false);

  create() {
    if (this.form.invalid) return;
    const subscription = forkJoin([
      this.imageFile()
        ? this.postService.uploadFile(this.imageFile()!)
        : of(null),
      ...this.files().map((file) => this.postService.uploadFile(file)),
    ]).pipe(
      switchMap(([image, ...attachmets]) =>
        this.data
          ? this.postService.updated({
              id: this.data._id,
              form: this.form.value,
              image: image
                ? image.filename
                : this.isImageRemoved()
                ? ''
                : undefined,
              attachments: attachmets,
            })
          : this.postService.create(this.form.value, attachmets, image)
      )
    );
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  selectImage(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const image = inputElement.files?.[0];
    if (!image) return;
    this._setImage(image);
  }

  removeImage() {
    this.imageFile.set(undefined);
    this.preview.set(null);
    this.isImageRemoved.set(true);
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

  private _setImage(image: File): void {
    const temp = this.preview();
    if (temp && temp.startsWith('blob:')) {
      URL.revokeObjectURL(temp);
    }
    this.preview.set(URL.createObjectURL(image));
    this.imageFile.set(image);
  }

  private loadForm() {
    if (!this.data) return;
    const { image, attachments, ...props } = this.data;
    this.form.patchValue(props);
    if (image) {
      this.postService.getFile(image).subscribe((resp) => {
        this.preview.set(URL.createObjectURL(resp));
      });
    }
  }
}
