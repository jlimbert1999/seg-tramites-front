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

import { ExternalProcedure } from '../../../../../domain/models';
import { handleFormErrorMessages } from '../../../../../helpers';
import {
  typeProcedureResponse,
  typeApplicant,
} from '../../../../../infraestructure/interfaces';
import { SimpleSelectSearchComponent } from '../../../../components';
import { ExternalService } from '../../../../services';
import { MaterialModule } from '../../../../../material.module';

interface SelectOption<T> {
  text: string;
  value: T;
}

@Component({
  selector: 'app-external',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MaterialModule,
    SimpleSelectSearchComponent,
  ],
  templateUrl: './external.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalComponent {
  private fb = inject(FormBuilder);
  private externalService = inject(ExternalService);
  private ddialogRef = inject(MatDialogRef<ExternalComponent>);

  public external = inject<ExternalProcedure | undefined>(MAT_DIALOG_DATA);
  public applicantType = signal<typeApplicant>('NATURAL');
  public hasRepresentative = signal<boolean>(false);
  public segments = signal<SelectOption<string>[]>([]);
  public typesProcedures = signal<SelectOption<typeProcedureResponse>[]>([]);

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
  requirements = signal<string[]>([]);

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
      this.externalService.getSegments().subscribe((segments) => {
        this.segments.set(
          segments.map((segment) => ({ text: segment, value: segment }))
        );
      });
    }
  }

  selectSegmentProcedure(segment: string) {
    this.FormProcedure.patchValue({ segment, type: '' });
    this.requirements.set([]);
    this.externalService
      .getTypesProceduresBySegment(segment)
      .subscribe((types) => {
        this.typesProcedures.set(
          types.map((type) => ({ value: type, text: type.nombre }))
        );
      });
  }

  selectTypeProcedure(type: typeProcedureResponse) {
    this.FormProcedure.patchValue({ type: type._id });
    this.requirements.set(
      type.requerimientos
        .filter((requirement) => requirement.activo)
        .map((type) => type.nombre)
    );
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
          Requeriments: this.requirements(),
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
          Validators.minLength(7),
          Validators.pattern('^[a-zA-Z0-9-]*$'),
        ],
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.minLength(7),
          Validators.pattern(/^[0-9-]*$/),
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
          Validators.pattern('^[a-zA-Z0-9-]*$'),
        ],
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.minLength(7),
          Validators.pattern('^[0-9-]*$'),
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
          Validators.minLength(7),
          Validators.pattern('^[0-9-]*$'),
        ],
      ],
      tipo: ['JURIDICO'],
    });
  }

  errorMessage(control: AbstractControl) {
    return handleFormErrorMessages(control);
  }
}
