import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-external-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './external-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExternalDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);



  ngOnInit(): void {
    // this.heroes$ = this.route.paramMap.pipe(
    //   switchMap((params) => {
    //     this.selectedId = Number(params.get('id'));
    //     return this.service.getHeroes();
    //   })
    // );
  }
}
