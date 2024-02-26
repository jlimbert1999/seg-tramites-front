import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  PaginatorComponent,
  ReportProcedureTableComponent,
  ServerSelectSearchComponent,
} from '../../../components';
import { CacheService, ReportService } from '../../../services';
import { GroupProcedure, StateProcedure } from '../../../../domain/models';
import { TableProcedureData } from '../../../../infraestructure/interfaces';

type SearchMode = 'simple' | 'advanced';
interface CacheData {
  form: Object;
  types: SelectOptiom[];
  data: TableProcedureData[];
  size: number;
  searchMode: SearchMode;
}
interface SelectOptiom {
  text: string;
  value: string;
}
interface PaginationOptions {
  limit: number;
  index: number;
}

interface SelectOption {
  text: string;
  value: string;
}

@Component({
  selector: 'app-report-search',
  standalone: true,
  imports: [
    CommonModule,
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
    PaginatorComponent,
    MatExpansionModule,
    ServerSelectSearchComponent,
  ],
  templateUrl: './report-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportSearchComponent {
  private fb = inject(FormBuilder);
  private reportService = inject(ReportService);
  private cacheService: CacheService<CacheData> = inject(CacheService);

  public searchMode = signal<SearchMode>('simple');
  public typeProcedures = signal<SelectOptiom[]>([]);
  public FormProcedure = computed<FormGroup>(() => {
    return this.searchMode() === 'simple'
      ? this.createSimpleForm()
      : this.createAdvancedForm();
  });
  public datasource = signal<TableProcedureData[]>([]);
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

  generate() {
    const isFormEmpty = Object.values(this.FormProcedure().value).every(
      (val) => val === ''
    );
    if (isFormEmpty) return;
    this.cacheService.pageIndex.set(0);
    this.getData();
  }

  clear() {
    this.FormProcedure().reset({});
    this.datasource.set([]);
    this.datasize.set(0);
    this.typeProcedures.set([]);
  }

  searchTypesProcedures(term: string) {
    if (!this.FormProcedure().get('group')?.value) return;
    const group =
      this.FormProcedure().get('group')?.value === GroupProcedure.External
        ? 'EXTERNO'
        : 'INTERNO';
    this.reportService
      .getTypeProceduresByText(term, group)
      .subscribe((types) => {
        this.typeProcedures.set(
          types.map((el) => ({ value: el._id, text: el.nombre }))
        );
      });
  }

  setTypeProcedure(id_type: string | undefined) {
    if (!id_type) {
      this.FormProcedure().removeControl('type');
      return;
    }
    this.FormProcedure().setControl('type', new FormControl(id_type));
  }

  changePage({ limit, index }: PaginationOptions) {
    this.cacheService.pageSize.set(limit);
    this.cacheService.pageIndex.set(index);
    this.getData();
  }

  selectSearchMode(value: SearchMode) {
    this.searchMode.set(value);
  }

  changeGroupProcedure() {
    this.FormProcedure().get('type')?.setValue('');
    this.typeProcedures.set([]);
  }

  private savePaginationData() {
    this.cacheService.resetPagination();
    const cache: CacheData = {
      form: this.FormProcedure().value,
      types: this.typeProcedures(),
      data: this.datasource(),
      size: this.datasize(),
      searchMode: this.searchMode(),
    };
    this.cacheService.save('report-search', cache);
  }

  private loadPaginationData() {
    const cacheData = this.cacheService.load('report-search');
    if (!this.cacheService.keepAliveData() || !cacheData) return;
    this.searchMode.set(cacheData.searchMode);
    this.FormProcedure().patchValue(cacheData.form);
    this.typeProcedures.set(cacheData.types);
    this.datasource.set(cacheData.data);
    this.datasize.set(cacheData.size);
  }

  private createSimpleForm(): FormGroup {
    return this.fb.group({
      code: ['', Validators.minLength(4)],
      reference: [''],
      group: [''],
    });
  }

  private createAdvancedForm(): FormGroup {
    return this.fb.group({
      code: ['', Validators.minLength(4)],
      state: [''],
      reference: [''],
      type: [''],
      start: [''],
      end: [new Date()],
      group: [''],
      cite: [''],
    });
  }

  get statesProcedure() {
    return Object.values(StateProcedure);
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
}
