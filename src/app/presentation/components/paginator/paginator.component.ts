import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
interface PageProps {
  limit: number;
  index: number;
}
@Component({
  selector: 'paginator',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './paginator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  @Input() limit!: number;
  @Input() index!: number;
  @Input() length!: number;
  @Input() pageSizeOptions!: number[];

  @Output() onPageChage: EventEmitter<PageProps> = new EventEmitter();

  changePage(event: PageEvent) {
    this.onPageChage.emit({
      limit: event.pageSize,
      index: event.pageIndex,
    });
  }
}
