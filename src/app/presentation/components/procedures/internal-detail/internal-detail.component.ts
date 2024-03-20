import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { LocationComponent } from '../location/location.component';
import { ProcedureService } from '../../../services';
import { locationResponse } from '../../../../infraestructure/interfaces';
import {
  GroupProcedure,
  InternalProcedure,
  Workflow,
} from '../../../../domain/models';
import { forkJoin } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { ListWorkflowComponent } from '../list-workflow/list-workflow.component';
import { GraphWorkflowComponent } from '../graph-workflow/graph-workflow.component';

@Component({
  selector: 'internal-detail',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LocationComponent,
    ListWorkflowComponent,
    GraphWorkflowComponent,
  ],
  templateUrl: './internal-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalDetailComponent implements OnInit {
  private procedureService = inject(ProcedureService);
  id = input.required<string>();

  public procedure = signal<InternalProcedure | null>(null);
  public location = signal<locationResponse[]>([]);
  public workflow = signal<Workflow[]>([]);

  ngOnInit(): void {
    forkJoin([
      this.procedureService.getDetail(this.id(), GroupProcedure.Internal),
      this.procedureService.getWorkflow(this.id()),
      this.procedureService.getLocation(this.id()),
    ]).subscribe((resp) => {
      this.procedure.set(resp[0] as InternalProcedure);
      this.workflow.set(resp[1]);
      this.location.set(resp[2]);
    });
  }
  get data() {
    return this.procedure()!;
  }
}
