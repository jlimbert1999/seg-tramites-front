import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { Observable, debounceTime, filter, startWith, switchMap } from 'rxjs';

import { InternalProcedure, Officer } from '../../../../../domain/models';
import { handleFormErrorMessages } from '../../../../../helpers';
import { typeProcedureResponse } from '../../../../../infraestructure/interfaces';
import { SimpleSelectSearchComponent } from '../../../../components';
import { AuthService, InternalService } from '../../../../services';

interface SelectOption {
  value: typeProcedureResponse;
  text: string;
}
@Component({
  selector: 'app-internal',
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
    MatAutocompleteModule,
    SimpleSelectSearchComponent,
  ],
  templateUrl: './internal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalComponent {
  private authService = inject(AuthService);
  private internalService = inject(InternalService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<InternalComponent>);

  public procedure: InternalProcedure = inject(MAT_DIALOG_DATA);
  public typesProcedures = signal<SelectOption[]>([]);
  public filteredEmitter!: Observable<Officer[]>;
  public filteredReceiver!: Observable<Officer[]>;
  public currentOption = signal<typeProcedureResponse | undefined>(undefined);
  public FormProcedure: FormGroup = this.fb.group({
    type: ['', Validators.required],
    amount: ['', Validators.required],
    segment: ['', Validators.required],
    reference: ['', Validators.required],
    fullname_receiver: ['', Validators.required],
    jobtitle_receiver: ['', Validators.required],
    fullname_emitter: [
      this.authService.account()?.officer.fullname,
      Validators.required,
    ],
    jobtitle_emitter: [
      this.authService.account()?.officer.jobtitle,
      Validators.required,
    ],
    //  TODO CODE OF DEPENDENCY
    cite: [this.authService.code()],
  });

  ngOnInit(): void {
    if (this.procedure) {
      this.FormProcedure.removeControl('type');
      this.FormProcedure.removeControl('segment');
      this.loadFormData();
    } else {
      this.internalService.getTypesProcedures().subscribe((data) => {
        const options = data.map((type) => ({
          value: type,
          text: type.nombre,
        }));
        this.typesProcedures.set(options);
        if (options[0]) {
          this.setTypeProcedure(options[0].value);
        }
      });
    }
    this.filteredEmitter = this.setAutocomplete('fullname_emitter');
    this.filteredReceiver = this.setAutocomplete('fullname_receiver');
  }

  save() {
    const observable = this.procedure
      ? this.internalService.edit(this.procedure._id, this.FormProcedure.value)
      : this.internalService.add(this.FormProcedure.value);
    observable.subscribe((procedure) => this.dialogRef.close(procedure));
  }

  setTypeProcedure(type: typeProcedureResponse) {
    this.FormProcedure.get('type')?.setValue(type._id);
    this.FormProcedure.get('segment')?.setValue(type.segmento);
    this.currentOption.set(type);
  }

  setJob(value: string, path: string) {
    this.FormProcedure.get(path)?.setValue(value);
  }

  errorMessage(control: AbstractControl) {
    return handleFormErrorMessages(control);
  }

  private loadFormData() {
    const {
      details: { remitente, destinatario },
      ...values
    } = this.procedure;
    this.FormProcedure.patchValue({
      fullname_emitter: remitente.nombre,
      jobtitle_emitter: remitente.cargo,
      fullname_receiver: destinatario.nombre,
      jobtitle_receiver: destinatario.cargo,
      ...values,
    });
  }

  private setAutocomplete(path: 'fullname_emitter' | 'fullname_receiver') {
    return this.FormProcedure.controls[path].valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      filter((value) => !!value),
      switchMap((value) => this._filterOfficers(value))
    );
  }

  private _filterOfficers(term: string) {
    return this.internalService
      .findParticipant(term)
      .pipe((officers) => officers);
  }
}
