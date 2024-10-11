import { Content, Table } from 'pdfmake/interfaces';
import {
  account,
  communicationResponse,
} from '../../infraestructure/interfaces';
import { StatusMail } from '../../domain/models';

function CreateSectionDetails(
  { officer, dependencia }: account,
  date: Date,
  inbox: communicationResponse[]
): Content[] {
  return [
    { text: 'DATOS DEL SOLICITANTE', alignment: 'center', bold: true },
    {
      margin: [20, 0, 20, 0],
      table: {
        widths: [120, '*'],
        body: [
          [
            {
              border: [false, false, false, false],
              text: 'Nombre completo:',
              bold: true,
              alignment: 'right',
            },
            {
              text: `${
                officer
                  ? `${officer.nombre} ${officer.paterno} ${officer.materno}`
                  : 'SIN FUNCIONARIO'
              }`.toUpperCase(),
            },
          ],
          [
            {
              border: [false, false, false, false],
              text: 'Cargo:',
              bold: true,
              alignment: 'right',
            },
            {
              text: `${'SIN CARGO'}`.toUpperCase(),
            },
          ],
          [
            {
              border: [false, false, false, false],
              text: 'Nombre de usuario:',
              bold: true,
              alignment: 'right',
            },
            {
              text: `s`.toUpperCase(),
            },
          ],
          [
            {
              border: [false, false, false, false],
              text: 'Unidad:',
              bold: true,
              alignment: 'right',
            },
            {
              text: `${dependencia.nombre}`.toUpperCase(),
            },
          ],
          [
            {
              border: [false, false, false, false],
              text: 'Numero CEL.:',
              bold: true,
              alignment: 'right',
            },
            {
              text: ``,
            },
          ],
        ],
      },
    },
    {
      text: '\n\nNumero Total de Tramites\n\n',
      alignment: 'center',
      bold: true,
    },
    {
      margin: [20, 0, 20, 0],
      table: {
        widths: [120, 100, 100, 100],
        body: [
          [
            {
              border: [false, false, false, false],
              text: '',
            },
            {
              border: [false, false, false, false],
              text: 'Aceptados',
              fontSize: 9,
            },
            {
              border: [false, false, false, false],
              text: 'Sin aceptar',
              fontSize: 9,
            },
            {
              border: [false, false, false, false],
              text: 'Total',
              fontSize: 9,
            },
          ],
          [
            {
              border: [false, false, false, false],
              text: 'Bandeja de entrada:',
              bold: true,
              alignment: 'right',
            },
            {
              text: `${
                inbox.filter(
                  (element) => element.status === StatusMail.Received
                ).length
              }`,
            },
            {
              text: `${
                inbox.filter((element) => element.status === StatusMail.Pending)
                  .length
              }`,
            },

            {
              text: `${inbox.length}`,
            },
          ],
        ],
      },
    },
    {
      text: '\n Nota: La cantidad de trámites aceptados debe ser igual a cantidad en físico',
      color: 'red',
      alignment: 'center',
      bold: true,
    },
    {
      margin: [20, 20, 20, 0],
      table: {
        widths: [120, 25, 75, 25, 100, 25, 80],
        body: [
          [
            {
              border: [false, false, false, false],
              text: 'Motivo:',
              bold: true,
              alignment: 'right',
            },
            {
              text: ` `,
            },
            {
              border: [false, false, false, false],
              text: 'Rotacion',
            },
            {
              text: `X`,
              alignment: 'center',
            },
            {
              border: [false, false, false, false],
              text: 'Desvinculacion',
            },
            {
              text: ``,
            },
            {
              border: [false, false, false, false],
              text: 'Otros',
            },
          ],
        ],
      },
    },
    {
      text: '\nObservaciones:',
      bold: true,
      alignment: 'center',
    },
    {
      table: {
        widths: [50, '*', 50],
        heights: 60,
        body: [
          [
            {
              border: [false, false, false, false],
              text: '',
            },
            {
              text: ` `,
            },
            {
              border: [false, false, false, false],
              text: '',
            },
          ],
        ],
      },
    },
    {
      text: '\n\nRecomendacion',
      bold: true,
      alignment: 'center',
    },
    {
      text: 'Se recomienda no dejar su contraseña de seguimiento de trámites a nadie\n\n',
      bold: true,
      alignment: 'center',
    },
    {
      margin: [0, 120, 0, 0],
      columns: [
        {
          width: 20,
          text: '',
        },
        {
          width: '*',
          text: 'Firma y sello solicitante',
          alignment: 'center',
        },
        {
          width: '*',
          text: [
            { text: 'Firma y sello inmediato superior\n' },
            {
              text: '(He verificado doc. física y no tiene trámites pendientes)',
              fontSize: 8,
            },
          ],
          alignment: 'center',
        },
        {
          width: 20,
          text: '',
        },
      ],
    },
  ];
}

function CreateSectionList(
  data: communicationResponse[],
  date: Date
): Content[] {
  const tableData: Table = {
    headerRows: 1,
    dontBreakRows: true,
    widths: [25, 100, '*', 50, 65, 40],
    body: [
      [
        { text: 'Nro.', bold: true, alignment: 'center' },
        { text: 'Alterno', bold: true, alignment: 'center' },
        { text: 'Descripcion', bold: true, alignment: 'center' },
        { text: 'Estado', bold: true, alignment: 'center' },
        { text: 'Fecha ingreso', bold: true, alignment: 'center' },
        { text: 'Recibido', bold: true, alignment: 'center' },
      ],
    ],
  };
  data.forEach((mail, index) => {
    tableData.body.push([
      { text: `${index + 1}`, alignment: 'center' },
      mail.procedure.code,
      mail.procedure.reference,
      mail.procedure.state,
      new Date(mail.outboundDate).toLocaleString(),
      ...(mail.status === StatusMail.Received
        ? [
            {
              text: `SI`,
              alignment: 'center',
            },
          ]
        : [
            {
              text: `NO`,
              fillColor: '#FE5F55',
              alignment: 'center',
              color: 'white',
            },
          ]),
    ]);
  });
  if (data.length === 0)
    tableData.body.push([
      { text: 'Sin tramites en bandeja', colSpan: 6, fontSize: 18 },
    ]);
  return [
    { text: '', pageBreak: 'before', pageOrientation: 'landscape' },
    {
      text: `LISTADO DE TRAMITES EN BANDEJA DE ENTRADA: ${date.toLocaleString()}\n\n`,
      bold: true,
      alignment: 'center',
    },
    {
      fontSize: 8,
      table: tableData,
    },
  ];
}

export const UnlinkSheet = {
  CreateSectionDetails,
  CreateSectionList,
};
