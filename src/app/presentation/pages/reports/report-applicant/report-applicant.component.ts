import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CacheService, ReportService } from '../../../services';
import {
  PaginatorComponent,
  ReportProcedureTableComponent,
  SidenavButtonComponent,
} from '../../../components';
import { Router, RouterModule } from '@angular/router';
import { reportProcedureData } from '../../../../infraestructure/interfaces';

interface PaginationOptions {
  limit: number;
  index: number;
}
type validReportType = 'solicitante' | 'representante';
type typeApplicant = 'NATURAL' | 'JURIDICO';
interface SearchParams {
  form: Object;
  typeSearch: validReportType;
  typeApplicant: typeApplicant;
  data: reportProcedureData[];
  size: number;
}

@Component({
  selector: 'app-report-applicant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatExpansionModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    SidenavButtonComponent,
    ReportProcedureTableComponent,
    PaginatorComponent,
  ],
  templateUrl: './report-applicant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportApplicantComponent {
  private fb = inject(FormBuilder);
  private cacheService: CacheService<SearchParams> = inject(CacheService);
  private reportService = inject(ReportService);
  private router = inject(Router);

  public typeSearch = signal<validReportType>('solicitante');
  public typeApplicant = signal<typeApplicant>('NATURAL');
  public FormApplicant = computed<FormGroup>(() => {
    if (this.typeSearch() === 'representante') {
      return this.FormByRepresentative();
    }
    return this.typeApplicant() === 'NATURAL'
      ? this.FormByApplicatNatural()
      : this.FormByApplicatJuridico();
  });
  public datasource = signal<reportProcedureData[]>([]);
  public datasize = signal<number>(0);
  public displaycolums = [
    { columnDef: 'code', header: 'Alterno' },
    { columnDef: 'applicant', header: 'Solicitante' },
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

  generate() {
    this.cacheService.pageIndex.set(0);
    this.getData();
  }

  getData() {
    if (!Object.values(this.FormApplicant().value).some((val) => val !== '')) {
      return;
    }
    this.reportService
      .searchProcedureByApplicant({
        limit: this.limit,
        offset: this.offset,
        type: this.typeSearch(),
        form: this.FormApplicant().value,
      })
      .subscribe(
        (resp) => {
          this.datasource.set(resp.procedures);
          this.datasize.set(resp.length);
        },
        () => this.datasource.set([])
      );
  }

  changePage({ limit, index }: PaginationOptions) {
    this.cacheService.pageSize.set(limit);
    this.cacheService.pageIndex.set(index);
    this.getData();
  }

  changeTypeSearch(type: validReportType) {
    this.typeSearch.set(type);
    if (this.typeSearch() === 'representante') {
      this.typeApplicant.set('NATURAL');
    }
  }

  private FormByApplicatNatural(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.minLength(3)]],
      paterno: ['', [Validators.minLength(3)]],
      materno: ['', [Validators.minLength(3)]],
      telefono: ['', [Validators.minLength(7)]],
      dni: ['', [Validators.minLength(6)]],
      tipo: ['NATURAL'],
    });
  }

  private FormByApplicatJuridico(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.minLength(3)]],
      telefono: ['', [Validators.minLength(6)]],
      tipo: ['JURIDICO'],
    });
  }

  private FormByRepresentative(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.minLength(3)]],
      paterno: ['', [Validators.minLength(3)]],
      materno: ['', [Validators.minLength(3)]],
      telefono: ['', [Validators.minLength(7)]],
      dni: ['', [Validators.minLength(6)]],
    });
  }

  private savePaginationData(): void {
    this.cacheService.resetPagination();
    this.cacheService.storage[this.constructor.name] = {
      form: this.FormApplicant().value,
      typeSearch: this.typeSearch(),
      typeApplicant: this.typeApplicant(),
      data: this.datasource(),
      size: this.datasize(),
    };
  }

  private loadPaginationData(): void {
    const cacheData = this.cacheService.storage[this.constructor.name];
    if (!this.cacheService.keepAliveData() || !cacheData) return;
    this.datasource.set(cacheData.data);
    this.datasize.set(cacheData.size);
    this.FormApplicant().patchValue(cacheData.form);
    this.typeApplicant.set(cacheData.typeApplicant);
    this.typeSearch.set(cacheData.typeSearch);
  }

  navigate({ id_procedure, group }: reportProcedureData) {
    this.router.navigate([`/home/reports/applicant`, group, id_procedure], {
      queryParams: { limit: this.limit, index: this.index },
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
