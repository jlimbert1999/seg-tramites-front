import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Subject, forkJoin } from 'rxjs';
import {
  ExternalProcedure,
  GroupProcedure,
  StateProcedure,
} from '../../../../domain/models';
import { ProcedureService } from '../../../services';

interface detailProps {
  id_procedure: string;
  group: GroupProcedure;
}
@Component({
  selector: 'external-detail',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  templateUrl: './external-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalDetailComponent implements OnInit {
  @Input() changeState: Subject<void> | undefined;
  @Input({ required: true }) properties!: detailProps;

  private destroyRef = inject(DestroyRef);
  private procedureService = inject(ProcedureService);

  detail = signal<ExternalProcedure | null>(null);
  location: any[] = [];

  ngOnInit(): void {
    this.getData();
    if (!this.changeState) return;
    this.changeState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const updated = new ExternalProcedure({
        ...this.procedure,
        state: StateProcedure.Observado,
      });
      this.detail.set(updated);
    });
  }

  getData() {
    forkJoin([
      this.procedureService.getDetail(
        this.properties.id_procedure,
        this.properties.group
      ),
      this.procedureService.getLocation(this.properties.id_procedure),
    ]).subscribe((data) => {
      this.detail.set(data[0] as ExternalProcedure);
      this.location = [...data[1]];
    });
  }

  get procedure() {
    return this.detail()!;
  }
}
