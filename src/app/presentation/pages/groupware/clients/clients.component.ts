import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { SidenavButtonComponent } from '../../../components';
import { SocketService } from '../../../services';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, MaterialModule, SidenavButtonComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent implements OnInit {
  private socketService = inject(SocketService);
  users = this.socketService.onlineUsers$;
  ngOnInit(): void {}
}
