import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';

import { AccountService } from './services/account.service';
import { CreateAccountComponent } from './create-account/create-account.component';
import { Account } from '../../../domain/models';
import {
  PaginatorComponent,
  SidenavButtonComponent,
  SelectSearchComponent,
} from '../../components';
import { EditAccountComponent } from './edit-account/edit-account.component';

interface PageProps {
  limit: number;
  index: number;
}
interface SelectOption {
  value: string;
  text: string;
}
@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    PaginatorComponent,
    SidenavButtonComponent,
    SelectSearchComponent,
  ],
  templateUrl: './accounts.component.html',
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
    'activo',
    'options',
  ];
  public accounts = signal<Account[]>([]);
  public institutions = signal<SelectOption[]>([]);
  public filteredInstitutions = signal<SelectOption[]>([]);
  public dependencies = signal<SelectOption[]>([]);
  public filteredDependencies = signal<SelectOption[]>([]);
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
      const options = data.map((inst) => ({
        text: inst.nombre,
        value: inst._id,
      }));
      this.institutions.set(options);
      this.filteredInstitutions.set(options);
    });
  }

  filterInstitutions(term: string) {
    this.filteredInstitutions.set(
      this.institutions().filter(
        (op) => op.text.toLowerCase().indexOf(term) > -1
      )
    );
  }

  getDependenciesByInstitution(id_institucion: string | undefined) {
    if (!id_institucion) {
      this.index.set(0);
      this.dependencies.set([]);
      this.id_dependencia = undefined;
      this.filteredDependencies.set([]);
      this.getData();
      return;
    }
    this.accountService
      .getDependenciesOfInstitution(id_institucion)
      .subscribe((data) => {
        this.dependencies.set(
          data.map((dependency) => ({
            value: dependency._id,
            text: dependency.nombre,
          }))
        );
        this.filteredDependencies.set(this.dependencies());
      });
  }

  filterDependencies(term: string) {
    this.filteredDependencies.set(
      this.dependencies().filter(
        (op) => op.text.toLowerCase().indexOf(term!) > -1
      )
    );
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

  applyFilterByDependency(id_dependency?: string) {
    this.index.set(0);
    this.id_dependencia = id_dependency;
    this.getData();
  }

  add() {
    const dialogRef = this.dialog.open(CreateAccountComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result: Account) => {
      if (!result) return;
      this.accounts.update((values) => [result, ...values]);
      this.length.update((values) => values++);
    });
  }

  edit(accont: Account) {
    const dialogRef = this.dialog.open(EditAccountComponent, {
      width: '1200px',
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
    const dialogRef = this.dialog.open(CreateAccountComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result: Account) => {
      if (!result) return;
      this.accounts.update((values) => [result, ...values]);
      this.length.update((values) => values++);
    });
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

  onPageChage({ limit, index }: PageProps) {
    this.limit.set(limit);
    this.index.set(index);
    this.getData();
  }
}
