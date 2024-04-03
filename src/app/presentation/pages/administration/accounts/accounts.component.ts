import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CreateAccountComponent } from './create-account/create-account.component';
import { Account } from '../../../../domain/models';
import {
  PaginatorComponent,
  SidenavButtonComponent,
  ServerSelectSearchComponent,
  SimpleSelectSearchComponent,
} from '../../../components';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { AccountService } from '../../../services';
import { MaterialModule } from '../../../../material.module';

interface SelectOption {
  value: string;
  text: string;
}
@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    PaginatorComponent,
    SidenavButtonComponent,
    ServerSelectSearchComponent,
    SimpleSelectSearchComponent,
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsComponent {
  private dialog = inject(MatDialog);
  private accountService = inject(AccountService);
  public displayedColumns = [
    'visibility',
    'login',
    'nombre',
    'dependency',
    'options',
  ];
  public accounts = signal<Account[]>([]);
  public institutions = signal<SelectOption[]>([]);
  public dependencies = signal<SelectOption[]>([]);

  public id_dependencia?: string;
  public text: string = '';

  public length = signal<number>(10);
  public limit = signal<number>(10);
  public index = signal<number>(0);
  public offset = computed<number>(() => this.limit() * this.index());

  ngOnInit(): void {
    this.getInstitutions();
    this.getData();
  }

  getInstitutions() {
    this.accountService.getInstitutions().subscribe((data) => {
      this.institutions.set(
        data.map(({ _id, nombre }) => ({
          text: nombre,
          value: _id,
        }))
      );
    });
  }

  selectInstitution(id: string | undefined) {
    this.dependencies.set([]);
    this.id_dependencia = undefined;
    if (!id) return;
    this.accountService.getDependenciesOfInstitution(id).subscribe((data) => {
      this.dependencies.set(
        data.map(({ _id, nombre }) => ({ value: _id, text: nombre }))
      );
    });
  }

  getData() {
    const subscription =
      this.text !== ''
        ? this.accountService.search({
            id_dependency: this.id_dependencia,
            text: this.text,
            limit: this.limit(),
            offset: this.offset(),
          })
        : this.accountService.findAll(
            this.id_dependencia,
            this.limit(),
            this.offset()
          );
    subscription.subscribe((data) => {
      this.accounts.set(data.accounts);
      this.length.set(data.length);
    });
  }

  appliFilterByText() {
    if (this.text === '') return;
    this.index.set(0);
    this.getData();
  }

  applyFilterByDependency(id_dependency: string | undefined) {
    this.index.set(0);
    this.id_dependencia = id_dependency;
    this.getData();
  }

  add() {
    const dialogRef = this.dialog.open(CreateAccountComponent, {
      maxWidth: '800px',
    });
    dialogRef.afterClosed().subscribe((result: Account) => {
      if (!result) return;
      this.accounts.update((values) => [result, ...values]);
      this.length.update((value) => (value += 1));
    });
  }

  edit(accont: Account) {
    const dialogRef = this.dialog.open(EditAccountComponent, {
      maxWidth: '800px',
      data: accont,
    });
    dialogRef.afterClosed().subscribe((result?: Account) => {
      if (!result) return;
      this.accounts.update((values) => {
        const index = values.findIndex((value) => value._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }

  assign() {
    // const dialogRef = this.dialog.open(Assig, {
    //   width: '1000px',
    // });
    // dialogRef.afterClosed().subscribe((result: Account) => {
    //   if (!result) return;
    //   this.accounts.update((values) => [result, ...values]);
    //   this.length.update((values) => values++);
    // });
  }

  cancelSearch() {
    this.index.set(0);
    this.text = '';
    this.getData();
  }

  toggleVisibility(account: Account) {
    this.accountService.toggleVisibility(account._id).subscribe((state) => {
      this.accounts.update((values) => {
        const index = values.findIndex((item) => item._id === account._id);
        values[index].isVisible = state;
        return [...values];
      });
    });
  }

  disable(account: Account) {
    this.accountService.disable(account._id).subscribe((activo) => {
      this.accounts.update((values) => {
        const index = values.findIndex((item) => item._id === account._id);
        values[index].activo = activo;
        return [...values];
      });
    });
  }

  onPageChage(params: { limit: number; index: number }) {
    this.limit.set(params.limit);
    this.index.set(params.index);
    this.getData();
  }
}
