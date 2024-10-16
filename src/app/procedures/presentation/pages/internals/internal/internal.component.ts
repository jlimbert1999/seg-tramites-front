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
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable, debounceTime, filter, startWith, switchMap } from 'rxjs';

import { InternalProcedure, Officer } from '../../../../../domain/models';
import {
  AutocompleteComponent,
  AutocompleteOption,
  SimpleSelectOption,
  SimpleSelectSearchComponent,
} from '../../../../../shared';
import { InternalService, ProfileService } from '../../../services';
import { typeProcedure } from '../../../../../administration/infrastructure';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-internal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    SimpleSelectSearchComponent,
    AutocompleteComponent,
  ],
  templateUrl: './internal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalComponent {
  private account = inject(ProfileService).account();
  private internalService = inject(InternalService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<InternalComponent>);

  public procedure: InternalProcedure = inject(MAT_DIALOG_DATA);
  public typesProcedures = signal<SimpleSelectOption<string>[]>([]);
  public filteredEmitter!: Observable<Officer[]>;
  public filteredReceiver!: Observable<Officer[]>;
  public currentOption = signal<typeProcedure | undefined>(undefined);
  public FormProcedure: FormGroup = this.fb.group({
    type: ['', Validators.required],
    numberOfDocuments: ['', Validators.required],
    segment: ['', Validators.required],
    reference: ['', Validators.required],
    fullname_receiver: ['', Validators.required],
    jobtitle_receiver: ['', Validators.required],
    fullname_emitter: [this.account?.officer?.fullname, Validators.required],
    jobtitle_emitter: [this.account?.jobtitle, Validators.required],
    cite: [this.account?.dependencia.codigo],
  });

  example = signal<AutocompleteOption<Officer>[]>([]);

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
        // this.typesProcedures.set(options);
        if (options[0]) {
          this.setTypeProcedure(options[0].value);
        }
      });
    }
    this.filteredEmitter = this.setAutocomplete('fullname_emitter');
    this.filteredReceiver = this.setAutocomplete('fullname_receiver');
  }

  save() {
    // const observable = this.procedure
    //   ? this.internalService.edit(this.procedure._id, this.FormProcedure.value)
    //   : this.internalService.add(this.FormProcedure.value);
    // observable.subscribe((procedure) => this.dialogRef.close(procedure));
  }

  setTypeProcedure(type: typeProcedure) {
    this.FormProcedure.get('type')?.setValue(type._id);
    this.FormProcedure.get('segment')?.setValue(type.segmento);
    this.currentOption.set(type);
  }

  setJob(value: string, path: string) {
    this.FormProcedure.get(path)?.setValue(value);
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

  test(term: string | null) {
    console.log(term);
    if (!term) return;
    this.internalService.findParticipant(term).subscribe((resp) => {
      console.log(resp);
      this.example.set(resp.map((el) => ({ text: el.fullname, value: el })));
    });
  }
}
