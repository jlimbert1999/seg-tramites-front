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

import { MaterialModule } from '../../../../../material.module';
import {
  SimpleSelectOption,
  SimpleSelectSearchComponent,
} from '../../../../../shared';
import { ExternalService } from '../../../services';
import { CustomValidators } from '../../../../../../helpers';

interface ListOption {
  name: string;
  isSelected: boolean;
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

  segments = signal<SimpleSelectOption<string>[]>([]);
  typesProcedures = signal<SimpleSelectOption<typeProcedureResponse>[]>([]);

  formProcedure: FormGroup = this.fb.group({
    segment: ['', Validators.required],
    numberOfDocuments: ['', Validators.required],
    reference: ['', Validators.required],
    type: ['', Validators.required],
    cite: [''],
  });

  formApplicant = computed<FormGroup>(() =>
    this.applicantType() === 'NATURAL'
      ? this._createFormApplicantNatural()
      : this._createFormApplicantJuridico()
  );
  formRepresentative = computed<FormGroup>(() =>
    this.hasRepresentative()
      ? this._createFormRepresentative()
      : this.fb.group({})
  );
  requirements = signal<ListOption[]>([]);

  ngOnInit(): void {
    if (this.external) {
      const { details, ...values } = this.external;
      this.formProcedure.removeControl('type');
      this.formProcedure.removeControl('segment');
      this.formProcedure.patchValue(values);
      this.applicantType.set(details.solicitante.tipo);

      this.applicantType.set(details.solicitante.tipo);
      this.formApplicant().patchValue(details.solicitante);

      this.hasRepresentative.set(details.representante ? true : false);
      this.formRepresentative().patchValue(details.representante ?? {});
    } else {
      this.externalService.getSegments().subscribe((segments) => {
        this.segments.set(
          segments.map((segment) => ({ text: segment, value: segment }))
        );
      });
    }
  }

  selectSegmentProcedure(segment: string) {
    this.formProcedure.patchValue({ segment, type: '' });
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
    this.formProcedure.patchValue({ type: type._id, reference: type.nombre });
    this.requirements.set(
      type.requerimientos
        .filter((requirement) => requirement.activo)
        .map((type) => ({ name: type.nombre, isSelected: true }))
    );
  }

  save() {
    if (this.external) {
      this.externalService
        .edit({
          id: this.external._id,
          FormProcedure: this.formProcedure.value,
          FormApplicant: this.formApplicant().value,
          FormRepresentative: this.formRepresentative().value,
        })
        .subscribe((procedure) => {
          this.ddialogRef.close(procedure);
        });
    } else {
      this.externalService
        .add({
          FormProcedure: this.formProcedure.value,
          FormApplicant: this.formApplicant().value,
          FormRepresentative: this.formRepresentative().value,
          Requeriments: this.requirements(),
        })
        .subscribe((procedure) => {
          this.ddialogRef.close(procedure);
        });
    }
  }
  errorMessage(control: AbstractControl) {
    return handleFormErrorMessages(control);
  }

  get validForms(): boolean {
    return (
      this.formProcedure.valid &&
      this.formApplicant().valid &&
      this.formRepresentative().valid
    );
  }

  private _createFormRepresentative(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, CustomValidators.onlyLetters]],
      paterno: ['', [Validators.required, CustomValidators.onlyLetters]],
      materno: ['', CustomValidators.onlyLetters],
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

  private _createFormApplicantNatural(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, CustomValidators.onlyLetters]],
      paterno: ['', [Validators.required, CustomValidators.onlyLetters]],
      materno: ['', CustomValidators.onlyLetters],
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

  private _createFormApplicantJuridico(): FormGroup {
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

  test() {
    const options = this.requirements()
      .filter((item) => item.isSelected)
      .map(({ name }) => name);
    this.formProcedure.get('requirements')?.setValue(options);
  }
}
