import { Injectable } from '@angular/core';
import { Account, Procedure, StatusMail, Workflow } from '../../domain/models';

import { TDocumentDefinitions } from 'pdfmake/interfaces';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { CreateRouteMap } from '../../helpers/pdf/route-map';
import {
  accountResponse,
  communicationResponse,
} from '../../infraestructure/interfaces';
import { AccountSheet, ApprovedSheet } from '../../helpers';
import { UnlinkSheet } from '../../helpers/pdf/unlink-form';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  async generateRouteSheet(procedure: Procedure, workflow: Workflow[]) {
    workflow = workflow
      .map(({ dispatches, ...values }) => ({
        ...values,
        dispatches: dispatches.filter(
          (el) => el.status !== StatusMail.Rejected
        ),
      }))
      .filter((el) => el.dispatches.length > 0);
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      pageMargins: [30, 30, 30, 30],
      content: await CreateRouteMap(procedure, workflow),
      footer: {
        margin: [10, 0, 10, 0],
        fontSize: 7,
        pageBreak: 'after',
        text: [
          {
            text: 'NOTA: Esta hoja de ruta de correspondencia, no debera ser separada ni extraviada del documento del cual se encuentra adherida, por constituirse parte indivisible del mismo',
            bold: true,
          },
          {
            text: '\nDireccion: Plaza 6 de agosto E-0415 - Telefono: No. Piloto 4701677 - 4702301 - 4703059 - Fax interno: 143',
            color: '#BC6C25',
          },
          {
            text: '\nE-mail: info@sacaba.gob.bo - Pagina web: www.sacaba.gob.bo',
            color: '#BC6C25',
          },
        ],
      },
      styles: {
        cabecera: {
          margin: [0, 0, 0, 2],
        },
        header: {
          fontSize: 10,
          bold: true,
        },
        tableExample: {
          fontSize: 8,
          alignment: 'center',
          margin: [0, 0, 0, 5],
        },
        selection_container: {
          fontSize: 7,
          alignment: 'center',
          margin: [0, 10, 0, 0],
        },
      },
    };
    pdfMake.createPdf(docDefinition).print();
  }

  async GenerateUnlinkSheet(
    data: communicationResponse[],
    account: accountResponse
  ) {
    const date = new Date();
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      content: [
        await ApprovedSheet.createHeader({
          code: 'SF-000-74-RG31',
          title:
            'SOLICITUD DE BAJA DE USUARIO DE SISTEMA DE SEGUIMIENTO DE TRAMITES',
          date: '20/06/2023',
        }),
        UnlinkSheet.CreateSectionDetails(account, date, data),
        UnlinkSheet.CreateSectionList(data, date),
      ],
      footer: function (currentPage, pageCount) {
        if (currentPage === 1)
          return [
            {
              margin: [10, 0, 10, 0],
              fontSize: 8,
              text: 'Este formulario no exime que a futuro se solicite al servidor(a) público información respecto a trámites o procesos que hubieran estado a su cargo hasta el último día laboral en la Entidad, también NO impide ni se constituye en prueba para ninguna Auditoria u otros.',
            },
          ];
        currentPage--;
        pageCount--;
        return [
          {
            margin: [0, 20, 20, 0],
            fontSize: 9,
            text: {
              text: 'Pagina ' + currentPage.toString() + ' de ' + pageCount,
              alignment: 'right',
            },
          },
        ];
      },
    };
    pdfMake.createPdf(docDefinition).print();
  }

  async createAccountSheet(account: Account, password: string) {
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      pageMargins: [40, 40, 40, 40],
      content: [
        await ApprovedSheet.createHeader({
          title:
            'ASIGNACION DE USUARIO DE SISTEMA DE SEGUIMIENTO DE TRAMITES INTERNOS Y EXTERNOS',
          code: 'SF-000-74-RG26',
          date: '20/02/2020',
        }),
        AccountSheet.createContent(account, password),
      ],
    };
    pdfMake.createPdf(docDefinition).print();
  }
}
