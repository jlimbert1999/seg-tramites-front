import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, of, startWith, switchMap, tap } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { SidenavButtonComponent } from '../../../components';
import { AlertService, SocketService } from '../../../services';
import { SocketClient } from '../../../../infraestructure/interfaces';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    SidenavButtonComponent,
    ReactiveFormsModule,
    FormsModule,
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

  ngOnInit(): void {
    this.filteredClients = this.clientCtrl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(''),
      switchMap((term) => {
        console.log(term);
        return this.socketService.listenClientConnection()  
      })
    );
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
