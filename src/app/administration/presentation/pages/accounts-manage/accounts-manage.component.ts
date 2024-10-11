import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';

import { EditAccountComponent } from './edit-account/edit-account.component';
import { MaterialModule } from '../../../../material.module';
import { CreateAccountDialogComponent } from './create-account-dialog/create-account-dialog.component';
import {
  PaginatorComponent,
  SidenavButtonComponent,
} from '../../../../presentation/components';
import {
  SearchInputComponent,
  ServerSelectSearchComponent,
  SimpleSelectOption,
  SimpleSelectSearchComponent,
} from '../../../../shared';
import { AccountService } from '../../services';
import { Account } from '../../../domain';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-accounts-manage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    OverlayModule,
    PaginatorComponent,
    MatPaginatorModule,
    SearchInputComponent,
    SidenavButtonComponent,
    ServerSelectSearchComponent,
    SimpleSelectSearchComponent,
  ],
  templateUrl: './accounts-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccountsManageComponent {
  private dialog = inject(MatDialog);
  private accountService = inject(AccountService);
  public displayedColumns = [
    'visibility',
    'nombre',
    'jobtitle',
    'dependency',
    'state',
    'options',
  ];

  public text: string = '';

  datasource = signal<Account[]>([]);
  datasize = signal<number>(10);
  limit = signal<number>(10);
  index = signal<number>(0);
  offset = computed<number>(() => this.limit() * this.index());
  term = signal<string>('');
  isOpen = false;

  institutions = signal<SimpleSelectOption<string>[]>([]);
  dependencies = signal<SimpleSelectOption<string>[]>([]);
  institution = signal<string | undefined>(undefined);
  dependency = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.getInstitutions();
    this.getData();
  }

  getData() {
    this.accountService
      .findAll({
        term: this.term(),
        limit: this.limit(),
        offset: this.offset(),
        dependency: this.dependency(),
      })
      .subscribe(({ accounts, length }) => {
        this.datasource.set(accounts);
        this.datasize.set(length);
      });
  }

  appliFilterByText() {
    if (this.text === '') return;
    this.index.set(0);
    this.getData();
  }

  applyFilterByDependency(dependency: string | undefined) {
    this.index.set(0);
    // this.dependency = dependency;
    this.getData();
  }

  create() {
    const dialogRef = this.dialog.open(CreateAccountDialogComponent, {
      width: '700px',
    });
    dialogRef.afterClosed().subscribe((result?: Account) => {
      if (!result) return;
      this.datasource.update((values) => {
        if (values.length === this.limit()) values.pop();
        return [result, ...values];
      });
      this.datasize.update((value) => (value += 1));
    });
  }

  update(account: Account) {
    const dialogRef = this.dialog.open(EditAccountComponent, {
      width: '700px',
      data: account,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result?: Account) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((value) => value._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }

  cancelSearch() {
    this.index.set(0);
    this.text = '';
    this.getData();
  }

  search(term: string) {
    this.index.set(0);
    this.term.set(term);
    this.getData();
  }

  filter() {
    this.index.set(0);
    this.getData();
    this.isOpen = false;
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.limit.set(pageSize);
    this.index.set(pageIndex);
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

  selectInstitution(id: string) {
    this.institution.set(id);
    this.dependencies.set([]);
    this.dependency.set(undefined);
    this.accountService.getDependenciesOfInstitution(id).subscribe((data) => {
      this.dependencies.set(
        data.map(({ _id, nombre }) => ({ value: _id, text: nombre }))
      );
    });
  }

  reset() {
    this.institution.set(undefined);
    this.dependency.set(undefined);
    this.dependencies.set([]);
    this.institutions.set([]);
  }
}
