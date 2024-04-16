export interface ReportSheetProps {
  title: string;
  results: ReportResults[];
  columns: ReportColumns[];
  parameters?: Object;
}

export interface ReportResults {
  [key: string]: any;
}

export interface ReportColumns {
  columnDef: keyof ReportResults;
  header: string;
}
