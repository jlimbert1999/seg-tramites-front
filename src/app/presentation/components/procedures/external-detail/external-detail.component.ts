import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ExternalProcedure } from '../../../../domain/models';
import { LocationComponent } from '../location/location.component';

@Component({
  selector: 'external-detail',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, LocationComponent],
  templateUrl: './external-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalDetailComponent implements OnInit {
  procedure = input.required<ExternalProcedure>();
  location = input.required<any[]>();

  ngOnInit(): void {}

  get data() {
    return this.procedure();
  }
}
