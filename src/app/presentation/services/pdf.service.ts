import { Injectable } from '@angular/core';
import { Procedure } from '../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  async generateRouteSheet(procedure: Procedure, workflow: any[]) {
    // workflow = workflow
    //   .map(({ detail, ...values }) => {
    //     const filteredItems = detail.filter(
    //       (send) => send.status !== statusMail.Rejected
    //     );
    //     return { ...values, detail: filteredItems };
    //   })
    //   .filter((element) => element.detail.length > 0);
    // const index = workflow.findIndex((element) => element.detail.length > 1);
    // const filteredWorkflow =
    //   index !== -1 ? workflow.slice(0, index + 1) : workflow;
    // const docDefinition: TDocumentDefinitions = {
    //   pageSize: 'LETTER',
    //   pageMargins: [30, 30, 30, 30],
    //   content: [
    //     await RouteMapPdf.CreateHeader(),
    //     RouteMapPdf.CreateFirstSection(procedure, workflow[0]),
    //     RouteMapPdf.CreateSecodSection(filteredWorkflow),
    //   ],
    //   footer: {
    //     margin: [10, 0, 10, 0],
    //     fontSize: 7,
    //     pageBreak: 'after',
    //     text: [
    //       {
    //         text: 'NOTA: Esta hoja de ruta de correspondencia, no debera ser separada ni extraviada del documento del cual se encuentra adherida, por constituirse parte indivisible del mismo',
    //         bold: true,
    //       },
    //       {
    //         text: '\nDireccion: Plaza 6 de agosto E-0415 - Telefono: No. Piloto 4701677 - 4702301 - 4703059 - Fax interno: 143',
    //         color: '#BC6C25',
    //       },
    //       {
    //         text: '\nE-mail: info@sacaba.gob.bo - Pagina web: www.sacaba.gob.bo',
    //         color: '#BC6C25',
    //       },
    //     ],
    //   },
    //   styles: {
    //     cabecera: {
    //       margin: [0, 0, 0, 10],
    //     },
    //     header: {
    //       fontSize: 10,
    //       bold: true,
    //     },
    //     tableExample: {
    //       fontSize: 8,
    //       alignment: 'center',
    //       margin: [0, 0, 0, 5],
    //     },
    //     selection_container: {
    //       fontSize: 7,
    //       alignment: 'center',
    //       margin: [0, 10, 0, 0],
    //     },
    //   },
    // };
    // pdfMake.createPdf(docDefinition).print();
  }
}
