import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import {
  LocationComponent,
  ObservationsComponent,
  WorkflowListComponent,
  WorkflowGraphComponent,
} from '../../index';
import {
  ExternalProcedure,
  GroupProcedure,
  StateProcedure,
  Workflow,
} from '../../../../domain/models';
import { AuthService, ProcedureService } from '../../../services';
import {
  locationResponse,
} from '../../../../infraestructure/interfaces';

@Component({
  selector: 'external-detail',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LocationComponent,
    ObservationsComponent,
    WorkflowGraphComponent,
    WorkflowListComponent,
  ],
  templateUrl: './external-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalDetailComponent implements OnInit {
  private authService = inject(AuthService);
  private procedureService = inject(ProcedureService);

  id = input.required<string>();
  enableOptions = input.required<boolean>();
  onStateChange = output<StateProcedure>();

  public procedure = signal<ExternalProcedure | null>(null);
  public workflow = signal<Workflow[]>([]);
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
      this.procedureService.getWorkflow(this.id()),
    ]).subscribe((resp) => {
      this.procedure.set(resp[0] as ExternalProcedure);
      this.location.set(resp[1]);
      this.workflow.set(resp[2]);
    });
  }

  changeStateProcedure(state: StateProcedure) {
    this.procedure.set(new ExternalProcedure({ ...this.data, state: state }));
    this.onStateChange.emit(state);
  }

  get data() {
    return this.procedure()!;
  }
}
