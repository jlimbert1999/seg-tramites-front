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
import { GroupProcedure, InternalProcedure } from '../../../../domain/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'internal-detail',
  standalone: true,
  imports: [CommonModule, LocationComponent],
  templateUrl: './internal-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalDetailComponent implements OnInit {
  private procedureService = inject(ProcedureService);

  public id = input.required<string>();
  public procedure = signal<InternalProcedure | null>(null);
  public location = signal<locationResponse[]>([]);

  ngOnInit(): void {
    forkJoin([
      this.procedureService.getDetail(this.id(), GroupProcedure.Internal),
      this.procedureService.getLocation(this.id()),
    ]).subscribe((resp) => {
      this.procedure.set(resp[0] as InternalProcedure);
      this.location.set(resp[1]);
    });
  }
  get data() {
    return this.procedure()!;
  }
}
