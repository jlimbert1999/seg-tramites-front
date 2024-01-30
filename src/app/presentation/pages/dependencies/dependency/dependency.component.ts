import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DependencyService } from '../services/dependency.service';
import { dependencyResponse } from '../interfaces/dependency-response.interface';
import { SelectSearchComponent } from '../../../components/select-search/select-search.component';

@Component({
  selector: 'app-dependency',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    SelectSearchComponent,
  ],
  templateUrl: './dependency.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependencyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<DependencyComponent>);
  private dependencyService = inject(DependencyService);
  private dependency?: dependencyResponse = inject(MAT_DIALOG_DATA);

  public institutions = signal<{ value: string; text: string }[]>([]);
  public FormDependency = this.fb.group({
    nombre: ['', Validators.required],
    codigo: ['', Validators.required],
    sigla: ['', [Validators.required, Validators.maxLength(10)]],
    institucion: ['', Validators.required],
  });

  public options = signal<{ text: string; value: string }[]>([]);
  public filteredOptons: { text: string; value: string }[] = [];

  ngOnInit(): void {
    if (this.dependency) {
      const { institucion, ...values } = this.dependency;
      // this.FormDependency.removeControl('institucion');
      this.FormDependency.patchValue(values);
    } else {
      // this.getInstitutions();
    }
  }

  getInstitutions(term: string | null) {
    if (!term) return;

    this.dependencyService.getInstitutions(term).subscribe((resp) => {
      this.options.set(
        resp.map((el) => ({
          value: el._id,
          text: el.nombre,
        }))
      );

      // this.filteredOptons = this.options;
    });
  }

  // filterInstitutions(term: string | null) {
  //   if (!term) this.filteredOptons = this.options;
  //   this.filteredOptons = this.options.filter(
  //     (op) => op.text.toLowerCase().indexOf(term!) > -1
  //   );
  // }

  save() {
    // const subscription = this.dependency
    //   ? this.dependenciasService.edit(
    //       this.dependency._id,
    //       this.FormDependency.value
    //     )
    //   : this.dependenciasService.add(this.FormDependency.value);
    // subscription.subscribe((resp) => {
    //   this.dialogRef.close(resp);
    // });
  }

  selectInstitution(id_institution: string) {
    this.FormDependency.get('institucion')?.setValue(id_institution);
  }
}
