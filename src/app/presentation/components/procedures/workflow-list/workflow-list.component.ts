import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Workflow } from '../../../../domain/models';

@Component({
  selector: 'workflow-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow-list.component.html',
  styleUrl: './workflow-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowListComponent {
  data = input.required<Workflow[]>();
}
