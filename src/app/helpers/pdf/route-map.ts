// import { Content, ContentTable, TableCell } from 'pdfmake/interfaces';
import { Content, ContentTable, TableCell } from 'pdfmake/interfaces';
import { convertImagenABase64 } from '../image_base64';
import { Procedure, Workflow } from '../../domain/models';

export class RouteMapPDF {
  static async createHeader(): Promise<Content> {
    return [
      {
        style: 'cabecera',
        columns: [
          {
            image: await convertImagenABase64(
              '../../../assets/img/gams/logo_alcaldia.jpeg'
            ),
            width: 150,
            height: 60,
          },
          {
            text: '\nHOJA DE RUTA DE CORRESPONDENCIA',
            bold: true,
            alignment: 'center',
          },
          {
            image: await convertImagenABase64(
              '../../../assets/img/gams/escudo_sacaba.jpeg'
            ),
            width: 70,
            height: 70,
          },
        ],
      },
    ];
  }
  static show(workflow: Workflow[]) {
    return [...createContainers(workflow)];
  }
}

interface RouteMapProps {
  index: number;
  officers: string[];
  reference: string;
  internalNumer: string;
  inDetail: detail;
  outDetail: detail;
}
interface detail {
  date: string;
  hour: string;
  quantity: string;
}

function CreateContainer({
  index,
  officers,
  reference,
  internalNumer,
  inDetail,
  outDetail,
}: RouteMapProps): ContentTable {
  return {
    fontSize: 7,
    unbreakable: true,
    table: {
      dontBreakRows: true,
      widths: [360, '*'],
      body: [
        [
          {
            margin: [0, 10, 0, 0],
            text: `DESTINATARIO ${index} (NOMBRE Y CARGO): ${officers.join(
              ' // '
            )}`,
            colSpan: 2,
            alignment: 'left',
            border: [true, false, true, false],
          },
          '',
        ],
        [
          {
            border: [true, false, false, false],
            table: {
              widths: [80, 300],
              body: [
                [
                  {
                    table: {
                      heights: 70,
                      widths: [70],
                      body: [
                        [
                          {
                            text: 'SELLO DE RECEPCION',
                            fontSize: 4,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                  },
                  [
                    { text: 'INSTRUCCION / PROVEIDO' },
                    {
                      text: `\n\n${reference}`,
                      bold: true,
                      alignment: 'center',
                    },
                  ],
                ],
              ],
            },
            layout: {
              defaultBorder: false,
            },
          },
          {
            rowSpan: 1,
            border: [false, false, true, false],
            table: {
              widths: [100, 40],
              body: [
                [
                  {
                    text: 'NRO. REGISTRO INTERNO (Correlativo)',
                    border: [false, false, false, false],
                  },
                  { text: internalNumer },
                ],
                [
                  {
                    text: '\n\n\n\n-----------------------------------------',
                    colSpan: 2,
                    border: [false, false, false, false],
                    alignment: 'right',
                  },
                ],
                [
                  {
                    text: 'FIRMA Y SELLO',
                    colSpan: 2,
                    border: [false, false, false, false],
                    alignment: 'right',
                  },
                ],
              ],
            },
          },
        ],
        [
          {
            colSpan: 2,
            border: [true, false, true, true],
            alignment: 'center',
            fontSize: 5,
            table: {
              widths: [30, 45, 35, '*', 30, 45, 35, '*'],
              body: [
                [
                  '',
                  'FECHA',
                  'HORA',
                  'CANTIDAD DE HOJAS / ANEXOS',
                  '',
                  'FECHA',
                  'HORA',
                  'CANTIDAD DE HOJAS / ANEXOS',
                ],
                [
                  {
                    text: 'INGRESO',
                    border: [false, false, false, false],
                    fontSize: 7,
                  },
                  {
                    text: `${inDetail.date}`,
                    fontSize: 8,
                    border: [true, true, true, true],
                  },
                  {
                    text: `${inDetail.hour}`,
                    fontSize: 8,
                    border: [true, true, true, true],
                  },
                  {
                    text: `${inDetail.quantity}`,
                    fontSize: 6,
                    border: [true, true, true, true],
                  },
                  {
                    text: 'SALIDA',
                    border: [false, false, false, false],
                    fontSize: 7,
                  },
                  {
                    text: `${outDetail.date}`,
                    border: [true, true, true, true],
                    fontSize: 8,
                  },
                  {
                    text: `${outDetail.hour}`,
                    border: [true, true, true, true],
                    fontSize: 8,
                  },
                  {
                    text: `${outDetail.quantity}`,
                    border: [true, true, true, true],
                    fontSize: 6,
                  },
                ],
              ],
            },
            layout: {
              defaultBorder: false,
            },
          },
        ],
      ],
    },
  };
}

function CreateFirstSection(procedure: Procedure, firstStage?: Workflow) {
  return {
    fontSize: 7,
    table: {
      widths: ['*'],
      body: [
        [{ text: 'PRIMERA PARTE', bold: true }],
        [
          {
            border: [true, false, true, false],
            style: 'selection_container',
            fontSize: 6,
            columns: [
              {
                width: 100,
                table: {
                  widths: [75, 5],
                  body: [
                    [
                      {
                        text: 'CORRESPONDENCIA INTERNA',
                        border: [false, false, false, false],
                      },
                      {
                        text: procedure.group === 'InternalDetail' ? 'X' : '',
                        style: 'header',
                      },
                    ],
                  ],
                },
              },
              {
                width: 100,
                table: {
                  widths: [75, 5],
                  body: [
                    [
                      {
                        text: 'CORRESPONDENCIA EXTERNA',
                        border: [false, false, false, false],
                      },
                      {
                        text: procedure.group === 'ExternalDetail' ? 'X' : '',
                        style: 'header',
                      },
                    ],
                  ],
                },
              },
              {
                width: 50,
                table: {
                  widths: [30, 5],
                  body: [
                    [
                      {
                        text: 'COPIA\n\n',
                        border: [false, false, false, false],
                      },
                      { text: '', style: 'header' },
                    ],
                  ],
                },
              },
              {
                width: '*',
                table: {
                  widths: [90, '*'],
                  body: [
                    [
                      {
                        text: 'NRO. UNICO DE CORRESPONDENCIA',
                        border: [false, false, false, false],
                      },
                      {
                        text: `${procedure.code}`,
                        bold: true,
                        fontSize: 11,
                      },
                    ],
                  ],
                },
              },
            ],
          },
        ],
        [
          {
            border: [true, false, true, false],
            columns: [
              {
                width: 60,
                text: '',
              },
              {
                fontSize: 5,
                alignment: 'center',
                table: {
                  widths: [100, 70, 60, 80],
                  body: [
                    ['', 'FECHA', 'HORA', 'CANTIDAD DE HOJAS / ANEXOS'],
                    [
                      {
                        text: 'EMISION / RECEPCION',
                        border: [false, false, false, false],
                        fontSize: 7,
                      },
                      {
                        text: `${procedure.StartDateDetail()}`,
                        fontSize: 8,
                        border: [true, true, true, true],
                      },
                      {
                        text: `${procedure.StartDateDetail()}`,
                        fontSize: 8,
                        border: [true, true, true, true],
                      },
                      {
                        text: `${procedure.amount}`,
                        fontSize: 6,
                        border: [true, true, true, true],
                      },
                    ],
                  ],
                },
                layout: {
                  defaultBorder: false,
                },
              },
              {
                width: 120,
                text: '',
              },
            ],
          },
        ],
        [
          {
            border: [true, false, true, false],
            table: {
              widths: ['*', '*'],
              body: [
                [{ text: 'DATOS DE ORIGEN', bold: true }, ''],
                [
                  `CITE: ${procedure.cite}`,
                  {
                    table: {
                      widths: [85, 100, 40],
                      body: [
                        [
                          { text: '', border: [false, false, false, false] },
                          {
                            text: 'NRO. REGISTRO INTERNO (Correlativo)',
                            border: [false, false, false, false],
                          },
                          {
                            text: ``,
                            fontSize: 9,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                  },
                ],
                [
                  `REMITENTE: ${procedure.applicantDetails.emitter.fullname}`,
                  `CARGO: ${procedure.applicantDetails.emitter.jobtitle}`,
                ],
                // [
                //   `DESTINATARIO: ${firstSendDetails.receiver.fullname}`,
                //   `CARGO: ${firstSendDetails.receiver.jobtitle}`,
                // ],
                [{ text: `REFERENCIA: ${procedure.reference}`, colSpan: 2 }],
              ],
            },
            layout: 'noBorders',
          },
        ],
        [
          {
            border: [true, false, true, false],
            columns: [
              {
                width: 65,
                text: '',
              },
              {
                fontSize: 5,
                alignment: 'center',
                table: {
                  widths: [95, 70, 60, 80],
                  body: [
                    ['', 'FECHA', 'HORA', 'CANTIDAD DE HOJAS / ANEXOS'],
                    [
                      {
                        text: 'SALIDA',
                        border: [false, false, false, false],
                        fontSize: 7,
                      },
                      // {
                      //   text: `${firstSendDetails.date}`,
                      //   border: [true, true, true, true],
                      //   fontSize: 8,
                      // },
                      // {
                      //   text: `${firstSendDetails.hour}`,
                      //   border: [true, true, true, true],
                      //   fontSize: 8,
                      // },
                      // {
                      //   text: `${firstSendDetails.quantity}`,
                      //   border: [true, true, true, true],
                      //   fontSize: 6,
                      // },
                    ],
                  ],
                },
                layout: {
                  defaultBorder: false,
                },
              },
              {
                width: 100,
                text: '',
              },
            ],
          },
        ],
      ],
    },
  };
}

function CreateSecodSection(workflow: Workflow[]) {
  //   const lastNumberPage = getLastPageNumber(workflow.length);
  //   if (workflow.length === 0)
  //     return createWhiteContainers(workflow.length + 1, lastNumberPage);
  //   return [
  //     ...createContainers(workflow),
  //     createWhiteContainers(
  //       workflow.length + 1,
  //       getLastPageNumber(workflow.length)
  //     ),
  //   ];
}
function getLastPageNumber(lengthData: number): number {
  if (lengthData <= 8) return 8;
  const firstTerm = 3;
  const increment = 5;
  const termsBefore = Math.ceil((lengthData - firstTerm) / increment);
  const nextTerm = firstTerm + termsBefore * increment;
  return nextTerm;
}

function createContainers(workflow: Workflow[]) {
  const containers: ContentTable[] = [];
  for (const [index, { dispatches }] of workflow.entries()) {
    const officers = dispatches.map(
      ({ receiver: { fullname, jobtitle } }) => `${fullname} ${jobtitle}`
    );
    if (dispatches.length > 1) {
      const container = CreateContainer({
        index: index,
        reference: dispatches[0].reference,
        officers: officers,
        internalNumer: '',
        inDetail: { date: '', hour: '', quantity: '' },
        outDetail: { date: '', hour: '', quantity: '' },
      });
      containers.push(container);
      break;
    }
    const nextStage = workflow
      .slice(index, workflow.length)
      .find(({ emitter }) => emitter.cuenta === dispatches[0].receiver.cuenta);

    const container = CreateContainer({
      index: index,
      reference: dispatches[0].reference,
      officers: officers,
      internalNumer: dispatches[0].internalNumer,
      inDetail: {
        date: dispatches[0].time.date,
        hour: dispatches[0].time.hour,
        quantity: dispatches[0].attachmentQuantity,
      },
      outDetail: nextStage
        ? {
            date: nextStage.time.date,
            hour: nextStage.time.hour,
            quantity: nextStage.dispatches[0].attachmentQuantity,
          }
        : { date: '', hour: '', quantity: '' },
    });
    containers.push(container);
  }
  return containers;
}
