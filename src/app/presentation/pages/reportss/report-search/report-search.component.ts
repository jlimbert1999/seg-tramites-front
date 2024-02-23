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
import { MatExpansionModule } from '@angular/material/expansion';

type SearchMode = 'simple' | 'advanced';
interface CacheData {
  form: Object;
  types: SelectOptiom[];
  data: reportProcedureData[];
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
  ],
  templateUrl: './report-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportSearchComponent {
  private fb = inject(FormBuilder);
  private reportService = inject(ReportService);
  private cacheService: CacheService<CacheData> = inject(CacheService);

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

  get statesProcedure() {
    return Object.values(StateProcedure);
  }

  get currentMatSelectOption() {
    return this.FormProcedure().get('type')?.value;
  }

  selectSearchMode(value: SearchMode) {
    this.searchMode.set(value);
  }

  resetForm() {
    this.FormProcedure().reset({});
    this.datasource.set([]);
    this.datasize.set(0);
  }

  private savePaginationData() {
    this.cacheService.resetPagination();
    const cache: CacheData = {
      form: this.FormProcedure().value,
      types: this.types(),
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
    this.types.set(cacheData.types);
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
