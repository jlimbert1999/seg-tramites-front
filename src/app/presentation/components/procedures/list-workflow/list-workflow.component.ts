import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Workflow } from '../../../../domain/models';

@Component({
  selector: 'list-workflow',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './list-workflow.component.html',
  styleUrl: './list-workflow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListWorkflowComponent { 
  @Input() data: Workflow[] = [];
}
