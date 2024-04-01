import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { SidenavButtonComponent } from '../../../components';
import { AlertService, SocketService } from '../../../services';
import { SocketClient } from '../../../../infraestructure/interfaces';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SidenavButtonComponent,
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent implements OnInit {
  private socketService = inject(SocketService);
  private alertService = inject(AlertService);
  private destroyRef = inject(DestroyRef);

  filteredClients: Observable<SocketClient[]>;
  clientCtrl = new FormControl('');

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.socketService.closeOne('listar');
    });
  }

  ngOnInit(): void {
    // this.filteredClients = combineLatest([
    //   this.socketService.listenClientConnection(),
    //   this.clientCtrl.valueChanges.pipe(startWith('')),
    // ]).pipe(
    //   takeUntilDestroyed(this.destroyRef),
    //   map(([clients, term]) => {
    //     if (!term) return clients;
    //     return clients.filter(({ officer: { fullname, jobtitle } }) => {
    //       const textToSearch = term.toLowerCase();
    //       return (
    //         fullname.toLowerCase().includes(textToSearch) ||
    //         jobtitle.toLowerCase().includes(textToSearch)
    //       );
    //     });
    //   })
    // );
    this.filteredClients = this.socketService.onlineClients$;
  }

  confirmRemove(client: SocketClient) {
    this.alertService.ConfirmAlert({
      title: `¿Expulsar al funcionario ${client.officer.fullname} (${client.officer.jobtitle})?`,
      text: `SESIONES ABIERTAS: ${client.socketIds.length}`,
      callback: (result) => {
        this._remove(client, result);
      },
    });
  }

  private _remove(client: SocketClient, message: string) {
    this.socketService.expelClient(client.id_account, message);
  }
}
