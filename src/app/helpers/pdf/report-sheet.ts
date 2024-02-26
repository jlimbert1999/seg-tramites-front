import { Content, ContentTable } from 'pdfmake/interfaces';

interface colums {
  columnDef: string;
  header: string;
}

export function GenerateReportSheet(
  form: Object,
  result: any[],
  colums: colums[]
): Content[] {
  return [CreateSectionForm(form), CreateTableResult(result, colums)];
}

function CreateSectionForm(form: Object): ContentTable {
  return {
    fontSize: 7,
    table: {
      body: Object.entries(form).map((field) => [field[0], field[1]]),
    },
  };
}

function CreateTableResult(result: any[], colums: colums[]): ContentTable {
  return {
    fontSize: 7,
    table: {
      body: [
        [...colums.map((colum) => colum.header)],
        ...result.map((field) => {
          return colums.map((colum) => [field[colum.columnDef]]);
        }),
      ],
    },
  };
}
