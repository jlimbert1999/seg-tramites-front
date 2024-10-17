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

interface workers {
  emitter: AutocompleteOption<Officer>[];
  receiver: AutocompleteOption<Officer>[];
}
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
  public currentOption = signal<typeProcedure | undefined>(undefined);
  public formProcedure: FormGroup = this.fb.group({
    type: ['', Validators.required],
    numberOfDocuments: ['', Validators.required],
    segment: ['', Validators.required],
    reference: ['', Validators.required],
    cite: [this.account?.dependencia.codigo],
    emitter: this.fb.group({
      fullname: [this.account?.officer?.fullname, Validators.required],
      jobtitle: [this.account?.jobtitle, Validators.required],
    }),
    receiver: this.fb.group({
      fullname: ['', Validators.required],
      jobtitle: ['', Validators.required],
    }),
  });
  emitters = signal<AutocompleteOption<Officer>[]>([]);
  receivers = signal<AutocompleteOption<Officer>[]>([]);
  officers = signal<workers>({ emitter: [], receiver: [] });

  ngOnInit(): void {
    if (this.procedure) {
      this.formProcedure.removeControl('type');
      this.formProcedure.removeControl('segment');
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
    // this.filteredEmitter = this.setAutocomplete('fullname_emitter');
    // this.filteredReceiver = this.setAutocomplete('fullname_receiver');
  }

  save() {
    // const observable = this.procedure
    //   ? this.internalService.edit(this.procedure._id, this.FormProcedure.value)
    //   : this.internalService.add(this.FormProcedure.value);
    // observable.subscribe((procedure) => this.dialogRef.close(procedure));
  }

  setTypeProcedure(type: typeProcedure) {
    this.formProcedure.get('type')?.setValue(type._id);
    this.formProcedure.get('segment')?.setValue(type.segmento);
    this.currentOption.set(type);
  }

  setJob(value: string, path: string) {
    this.formProcedure.get(path)?.setValue(value);
  }

  fullname(path: string): { fullname: string; jobtitle: string } {
    const { fullname = '', jobtitle = '' } = this.formProcedure.get(
      `${path}`
    )?.value;
    return {
      fullname,
      jobtitle,
    };
  }

  private loadFormData() {
    const {
      details: { remitente, destinatario },
      ...values
    } = this.procedure;
    this.formProcedure.patchValue({
      fullname_emitter: remitente.nombre,
      jobtitle_emitter: remitente.cargo,
      fullname_receiver: destinatario.nombre,
      jobtitle_receiver: destinatario.cargo,
      ...values,
    });
  }

  searchOfficers(worker: 'emitter' | 'receiver', term: string): void {
    this.formProcedure.get(`${worker}.fullname`)?.setValue(term);
    if (!term) return;
    this.internalService.findParticipant(term).subscribe((data) => {
      const options: AutocompleteOption<Officer>[] = data.map((el) => ({
        text: el.fullname,
        value: el,
      }));
      this.officers.update((values) => ({ ...values, [worker]: options }));
    });
  }


}
