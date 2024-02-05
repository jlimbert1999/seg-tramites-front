import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-list-workflow',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './list-workflow.component.html',
  styleUrl: './list-workflow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListWorkflowComponent { }
