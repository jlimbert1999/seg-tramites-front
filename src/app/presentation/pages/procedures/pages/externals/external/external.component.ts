import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { SimpleSelectSearchComponent } from '../../../../../components/simple-select-search/simple-select-search.component';
import { ExternalProcedure } from '../../../../../../domain/models';
import {
  typeApplicant,
  typeProcedureResponse,
} from '../../../../../../infraestructure/interfaces';
import { ExternalService } from '../../../../../services';
import { handleFormErrorMessages } from '../../../../../../helpers';

interface SelectOption {
  text: string;
  value: string;
}

interface SelectTypeProcedureOption {
  text: string;
  value: typeProcedureResponse;
}

@Component({
  selector: 'app-external',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatRadioModule,
    SimpleSelectSearchComponent,
  ],
  templateUrl: './external.component.html',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalComponent {
  private fb = inject(FormBuilder);
  private externalService = inject(ExternalService);
  private ddialogRef = inject(MatDialogRef<ExternalComponent>);

  public external?: ExternalProcedure = inject(MAT_DIALOG_DATA);
  applicantType = signal<typeApplicant>('NATURAL');
  hasRepresentative = signal<boolean>(false);
  segments = signal<SelectOption[]>([]);
  typesProcedures = signal<SelectTypeProcedureOption[]>([]);

  readonly documents: string[] = [
    'Carnet de identidad',
    'Libreta servicio militar',
    'Pasaporte',
  ];

  FormProcedure: FormGroup = this.fb.group({
    segment: ['', Validators.required],
    amount: ['', Validators.required],
    reference: ['', Validators.required],
    type: ['', Validators.required],
    cite: [''],
  });

  FormApplicant = computed<FormGroup>(() =>
    this.applicantType() === 'NATURAL'
      ? this.createFormApplicantNatural()
      : this.createFormApplicantJuridico()
  );
  FormRepresentative = computed<FormGroup>(() =>
    this.hasRepresentative()
      ? this.createFormRepresentative()
      : this.fb.group({})
  );
  requirements: string[] = [];

  ngOnInit(): void {
    if (this.external) {
      const { details, ...values } = this.external;
      this.FormProcedure.removeControl('type');
      this.FormProcedure.removeControl('segment');
      this.FormProcedure.patchValue(values);
      this.applicantType.set(details.solicitante.tipo);

      this.applicantType.set(details.solicitante.tipo);
      this.FormApplicant().patchValue(details.solicitante);

      this.hasRepresentative.set(details.representante ? true : false);
      this.FormRepresentative().patchValue(details.representante ?? {});
    } else {
      this.externalService.getSegments().subscribe((data) => {
        this.segments.set(
          data.map((segment) => ({ text: segment, value: segment }))
        );
      });
    }
  }

  getTypesProceduresBySegment(segment: string) {
    this.FormProcedure.get('segment')?.setValue(segment);
    this.FormProcedure.get('type')?.setValue('');
    this.requirements = [];
    this.externalService
      .getTypesProceduresBySegment(segment)
      .subscribe((data) => {
        this.typesProcedures.set(
          data.map((type) => ({ value: type, text: type.nombre }))
        );
      });
  }
  selectTypeProcedure(type: typeProcedureResponse) {
    this.FormProcedure.get('type')?.setValue(type._id);
    this.requirements = type.requerimientos
      .filter((requirement) => requirement.activo)
      .map((type) => type.nombre);
  }

  save() {
    if (this.external) {
      this.externalService
        .edit({
          id: this.external._id,
          FormProcedure: this.FormProcedure.value,
          FormApplicant: this.FormApplicant().value,
          FormRepresentative: this.FormRepresentative().value,
        })
        .subscribe((procedure) => {
          this.ddialogRef.close(procedure);
        });
    } else {
      this.externalService
        .add({
          FormProcedure: this.FormProcedure.value,
          FormApplicant: this.FormApplicant().value,
          FormRepresentative: this.FormRepresentative().value,
          Requeriments: this.requirements,
        })
        .subscribe((procedure) => {
          this.ddialogRef.close(procedure);
        });
    }
  }

  get validForms(): boolean {
    return (
      this.FormProcedure.valid &&
      this.FormApplicant().valid &&
      this.FormRepresentative().valid
    );
  }

  private createFormRepresentative(): FormGroup {
    return this.fb.group({
      nombre: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZñÑ\s.]*$/)],
      ],
      paterno: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZñÑ\s.]*$/)],
      ],
      materno: ['', Validators.pattern(/^[a-zA-ZñÑ\s.]*$/)],
      documento: ['', Validators.required],
      dni: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(10),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
    });
  }
  private createFormApplicantNatural(): FormGroup {
    return this.fb.group({
      nombre: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZñÑ\s.]*$/)],
      ],
      paterno: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZñÑ\s.]*$/)],
      ],
      materno: ['', Validators.pattern(/^[a-zA-ZñÑ\s.]*$/)],
      documento: ['', Validators.required],
      dni: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      tipo: ['NATURAL'],
    });
  }
  private createFormApplicantJuridico(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      telefono: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      tipo: ['JURIDICO'],
    });
  }

  errorMessage(control: AbstractControl) {
    return handleFormErrorMessages(control);
  }
}
