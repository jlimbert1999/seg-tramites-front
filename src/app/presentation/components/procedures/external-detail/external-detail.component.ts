import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { MaterialModule } from '../../../../material.module';
import { LocationComponent, ObservationsComponent } from '../../index';
import {
  ExternalProcedure,
  GroupProcedure,
  StateProcedure,
} from '../../../../domain/models';
import { AuthService, ProcedureService } from '../../../services';
import { locationResponse } from '../../../../infraestructure/interfaces';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'external-detail',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LocationComponent,
    ObservationsComponent,
  ],
  templateUrl: './external-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalDetailComponent implements OnInit {
  private authService = inject(AuthService);
  private procedureService = inject(ProcedureService);

  public id = input.required<string>();
  public enableOptions = input.required<boolean>();

  public procedure = signal<ExternalProcedure | null>(null);
  public location = signal<locationResponse[]>([]);
  public manager = computed(() => {
    if (!this.enableOptions()) return undefined;
    return this.authService.account()?.id_account;
  });

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    forkJoin([
      this.procedureService.getDetail(this.id(), GroupProcedure.External),
      this.procedureService.getLocation(this.id()),
    ]).subscribe((resp) => {
      this.procedure.set(resp[0] as ExternalProcedure);
      this.location.set(resp[1]);
    });
  }

  chageStateProcedure(state: StateProcedure) {
    this.procedure.set(new ExternalProcedure({ ...this.data, state: state }));
  }

  get data() {
    return this.procedure()!;
  }
}
