import {
  Content,
  ContentTable,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { convertImageABase64 } from '../image_base64';

interface SheetProps {
  title: string;
  manager: string;
  results: results[];
  columns: columns[];
}
interface results {
  [key: string]: string | number | boolean;
}
interface columns {
  columnDef: keyof results;
  header: string;
}

export async function createReportSheet(
  props: SheetProps
): Promise<TDocumentDefinitions> {
  const docDefinition: TDocumentDefinitions = {
    header: {
      columns: [
        {
          width: 100,
          image: await convertImageABase64(
            '../../../assets/img/gams/logo_alcaldia.jpeg'
          ),
        },
        {
          width: '*',
          text: [`\n${props.title}`],
          bold: true,
          fontSize: 16,
        },
        {
          width: 100,
          text: `${new Date().toLocaleString()}`,
          fontSize: 10,
          bold: true,
          alignment: 'left',
        },
      ],
      alignment: 'center',
      margin: [10, 10, 10, 10],
    },
    footer: {
      margin: [10, 0, 10, 0],
      fontSize: 8,
      text: `Generado por: ${props.manager}`,
    },
    pageSize: 'LETTER',
    pageOrientation: 'portrait',
    pageMargins: [30, 110, 40, 30],
    content: [generateSectionResults(props.results, props.columns)],
  };
  return docDefinition;
}

// export async function GenerateReportSheet(
//   form: Object,
//   result: any[],
//   colums: columns[]
// ): Promise<Content[]> {
//   return [CreateTableResult(result, colums)];
// }

// function CreateSectionForm(form: Object): ContentTable {
//   return {
//     fontSize: 7,
//     table: {
//       body: Object.entries(form).map((field) => [field[0], field[1]]),
//     },
//   };
// }

function generateSectionResults(
  results: results[],
  colums: columns[]
): ContentTable {
  return {
    fontSize: 7,
    table: {
      body: [
        [...colums.map((colum) => colum.header)],
        ...results.map((field) => {
          return colums.map((colum) => [field[colum.columnDef]]);
        }),
      ],
    },
  };
}
