import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { Observable, map, startWith } from 'rxjs';
import { TypeProcedureService } from '../services/type-procedure.service';
import {
  typeProcedureResponse,
  requirement,
} from '../../../../../infraestructure/interfaces';
import Swal from 'sweetalert2';
import { read, utils } from 'xlsx';

@Component({
  selector: 'app-type-procedure',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './type-procedure.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TypeProcedureComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TypeProcedureComponent>);
  private typeService = inject(TypeProcedureService);
  private destroy = inject(DestroyRef);

  public typeProcedure?: typeProcedureResponse = inject(MAT_DIALOG_DATA);
  public segments = signal<string[]>([]);
  public FormTypeProcedure: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    segmento: ['', Validators.required],
    tipo: ['', Validators.required],
    requerimientos: this.fb.array([]),
  });

  filteredSegments!: Observable<string[]>;
  dataSource: requirement[] = [];
  denieRequirements: boolean | undefined;

  ngOnInit(): void {
    if (this.typeProcedure) {
      this.FormTypeProcedure.removeControl('tipo');
      this.FormTypeProcedure.removeControl('segmento');
      this.typeProcedure.requerimientos.forEach(() => this.addRequirement());
      this.FormTypeProcedure.patchValue(this.typeProcedure);
    } else {
      this.typeService.getSegments().subscribe((segments) => {
        this.segments.set(segments);
        this.filteredSegments = this.FormTypeProcedure.get(
          'segmento'
        )!.valueChanges.pipe(
          takeUntilDestroyed(this.destroy),
          startWith(''),
          map((value) => this._filterSegments(value || ''))
        );
      });
    }
  }

  save() {
    const subscription = this.typeProcedure
      ? this.typeService.edit(
          this.typeProcedure._id,
          this.FormTypeProcedure.value
        )
      : this.typeService.add(this.FormTypeProcedure.value);
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }

  addRequirement() {
    this.requeriments.push(
      this.fb.group({
        nombre: ['', Validators.required],
        activo: true,
      })
    );
  }

  get requeriments() {
    return this.FormTypeProcedure.get('requerimientos') as FormArray;
  }
  removeRequirement(index: number) {
    this.requeriments.removeAt(index);
  }

  private _filterSegments(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.segments().filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  async upload() {
    const { value: file } = await Swal.fire({
      title: 'Seleccione el archivo a cargar',
      text: 'Formatos permitidos :ods, csv, xlsx',
      input: 'file',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      inputAttributes: {
        accept: '.xlsx, .xls',
        'aria-label': 'Cargar archivo excel',
      },
    });
    if (file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e) => {
        const wb = read(reader.result, {
          type: 'binary',
          cellDates: true,
        });
        const data: { nombre: string }[] = utils.sheet_to_json<any>(
          wb.Sheets[wb.SheetNames[0]]
        );
        const controls = new FormArray([
          ...data.map((item) =>
            this.fb.group({
              nombre: [item.nombre, Validators.required],
              activo: true,
            })
          ),
        ]);
        this.FormTypeProcedure.setControl('requerimientos', controls);
      };
    }
  }
}
