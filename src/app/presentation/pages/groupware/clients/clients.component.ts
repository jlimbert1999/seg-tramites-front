import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, startWith, switchMap } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { SidenavButtonComponent } from '../../../components';
import { AlertService, SocketService } from '../../../services';
import { UserSocket } from '../../../../infraestructure/interfaces';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    SidenavButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent implements OnInit {
  private socketService = inject(SocketService);
  private alertService = inject(AlertService);
  private destroyRef = inject(DestroyRef);

  filteredClients: Observable<UserSocket[]>;
  clientCtrl = new FormControl('');

  ngOnInit(): void {
    this.filteredClients = this.clientCtrl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(''),
      switchMap((term) => {
        if (!term) return this.socketService.onlineUsers$;
        return this.socketService.onlineUsers$.pipe(
          map((clients) =>
            clients.filter(({ officer: { fullname, jobtitle } }) => {
              return (
                fullname.toLowerCase().includes(term?.toLowerCase()) ||
                jobtitle.toLowerCase().includes(term.toLowerCase())
              );
            })
          )
        );
      })
    );
  }
  confirmRemove(client: UserSocket) {
    this.alertService.ConfirmAlert({
      title: `¿Expulsar al funcionario ${client.officer.fullname} (${client.officer.jobtitle})?`,
      text: `SESIONES ABIERTAS: ${client.socketIds.length}`,
      callback: (result) => {
        this._remove(client, result);
      },
    });
  }

  private _remove(client: UserSocket, message: string) {
    this.socketService.expelClient(client.id_account, message);
  }
}
