import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  PaginatorComponent,
  ReportProcedureTableComponent,
  SidenavButtonComponent,
} from '../../../components';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CacheService, ReportService } from '../../../services';
import { reportProcedureData } from '../../../../infraestructure/interfaces';
import { StateProcedure } from '../../../../domain/models';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';

type SearchMode = 'simple' | 'advanced';
interface SearchParams {
  form: Object;
  types: SelectOptiom[];
  data: reportProcedureData[];
  size: number;
  searchMode: SearchMode;
  panelIsOpened: boolean;
}
interface SelectOptiom {
  text: string;
  value: string;
}
interface PaginationOptions {
  limit: number;
  index: number;
}

@Component({
  selector: 'app-report-search',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule,
    ReportProcedureTableComponent,
    SidenavButtonComponent,
    PaginatorComponent,
  ],
  templateUrl: './report-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportSearchComponent {
  private fb = inject(FormBuilder);
  private reportService = inject(ReportService);
  private cacheService: CacheService<SearchParams> = inject(CacheService);
  private router = inject(Router);

  public panelIsOpened = signal<boolean>(true);
  public searchMode = signal<SearchMode>('simple');
  public types = signal<SelectOptiom[]>([]);
  public FormProcedure = computed<FormGroup>(() => {
    return this.searchMode() === 'simple'
      ? this.createSimpleForm()
      : this.createAdvancedForm();
  });
  public datasource = signal<reportProcedureData[]>([]);
  public datasize = signal<number>(0);
  public displaycolums = [
    { columnDef: 'code', header: 'Alterno' },
    { columnDef: 'reference', header: 'Referencia' },
    { columnDef: 'state', header: 'Estado' },
    { columnDef: 'date', header: 'Fecha' },
  ];

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.savePaginationData();
    });
  }

  ngOnInit(): void {
    this.loadPaginationData();
  }

  searchTypesProcedures(text: string) {
    this.reportService.searchTypeProceduresByText(text).subscribe((types) => {
      this.types.set(types.map((el) => ({ value: el._id, text: el.nombre })));
    });
  }

  selectTypeProcedure(id_type: string) {
    // this.formProcedure.get('type')?.setValue(id_type);
  }

  getData() {
    this.reportService
      .searchProcedureByProperties(
        this.limit,
        this.offset,
        this.FormProcedure().value
      )
      .subscribe((resp) => {
        this.datasource.set(resp.procedures);
        this.datasize.set(resp.length);
      });
  }

  changePage({ limit, index }: PaginationOptions) {
    this.cacheService.pageSize.set(limit);
    this.cacheService.pageIndex.set(index);
    this.getData();
  }

  generate() {
    this.cacheService.pageIndex.set(0);
    this.getData();
  }

  navigate({ id_procedure, group }: reportProcedureData) {
    this.router.navigate([`/home/reports/search`, group, id_procedure], {
      queryParams: { limit: this.limit, index: this.index },
    });
  }

  get statesProcedure() {
    return Object.values(StateProcedure);
  }

  get currentMatSelectOption() {
    return this.FormProcedure().get('type')?.value;
  }

  selectSearchMode(value: SearchMode) {
    this.datasize.set(0);
    this.datasource.set([]);
    this.panelIsOpened.set(true);
    this.searchMode.set(value);
  }

  togglePanel() {
    this.panelIsOpened.update((value) => !value);
  }

  resetForm() {
    this.FormProcedure().reset({});
    this.datasource.set([]);
    this.datasize.set(0);
  }

  get limit() {
    return this.cacheService.pageSize();
  }
  get offset() {
    return this.cacheService.pageOffset();
  }
  get index() {
    return this.cacheService.pageIndex();
  }

  private savePaginationData() {
    this.cacheService.resetPagination();
    this.cacheService.storage[this.constructor.name] = {
      form: this.FormProcedure().value,
      types: this.types(),
      data: this.datasource(),
      size: this.datasize(),
      searchMode: this.searchMode(),
      panelIsOpened: this.panelIsOpened(),
    };
  }

  private loadPaginationData() {
    const cacheData = this.cacheService.storage[this.constructor.name];
    if (!this.cacheService.keepAliveData() || !cacheData) return;
    this.searchMode.set(cacheData.searchMode);
    this.FormProcedure().patchValue(cacheData.form);
    this.types.set(cacheData.types);
    this.datasource.set(cacheData.data);
    this.datasize.set(cacheData.size);
    this.panelIsOpened.set(cacheData.panelIsOpened);
  }

  private createSimpleForm(): FormGroup {
    return this.fb.group({
      code: ['', [Validators.minLength(4), Validators.required]],
      group: [''],
    });
  }

  private createAdvancedForm(): FormGroup {
    return this.fb.group({
      code: ['', [Validators.minLength(4), Validators.required]],
      state: [''],
      reference: [''],
      type: [''],
      start: [''],
      end: [new Date()],
      group: [''],
      cite: [''],
    });
  }
}
