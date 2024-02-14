import { Content, ContentTable } from 'pdfmake/interfaces';
import { convertImageABase64, TimeManager, toOrdinal } from '../';
import { GroupProcedure, Procedure, Workflow } from '../../domain/models';

interface RouteMapProps {
  index: number;
  officers: string[];
  reference: string;
  internalNumber: string;
  inDetail: detail;
  outDetail: detail;
}

interface detail {
  date: string;
  hour: string;
  quantity: string;
}

interface originDetails {
  code: string;
  group: GroupProcedure;
  reference: string;
  cite: string;
  emitter: participant;
  inDetail: detail;
  outDetail: detail;
  receiver: participant;
  internalNumber: string;
}

interface participant {
  fullname: string;
  jobtitle: string;
}
export async function CreateRouteMap(
  procedure: Procedure,
  workflow: Workflow[]
): Promise<Content[]> {
  return [
    await createHeaderContainer(),
    firstSection(procedure, workflow[0]),
    secondSection(workflow),
  ];
}

function secondSection(workflow: Workflow[]) {
  const containers: ContentTable[] = [];
  console.log(workflow);
  for (const [index, { dispatches }] of workflow.entries()) {
    const officers = dispatches.map(
      ({ receiver: { fullname, jobtitle } }) => `${fullname} (${jobtitle})`
    );
    if (dispatches.length > 1) {
      const container = createStageContainer({
        index: index,
        reference: dispatches[0].reference,
        officers: officers,
        internalNumber: '',
        inDetail: { date: '', hour: '', quantity: '' },
        outDetail: { date: '', hour: '', quantity: '' },
      });
      containers.push(container);
      break;
    }
    const nextStage = workflow
      .slice(index, workflow.length)
      .find(({ emitter }) => emitter.cuenta === dispatches[0].receiver.cuenta);

    const container = createStageContainer({
      index: index,
      reference: dispatches[0].reference,
      officers: officers,
      internalNumber: dispatches[0].internalNumber,
      inDetail: dispatches[0].date
        ? {
            date: TimeManager.formatDate(dispatches[0].date, 'MM/D/YYYY'),
            hour: TimeManager.formatDate(dispatches[0].date, 'HH:mm'),
            quantity: dispatches[0].attachmentQuantity,
          }
        : { date: '', hour: '', quantity: '' },
      outDetail: nextStage
        ? {
            date: TimeManager.formatDate(nextStage.date, 'MM/D/YYYY'),
            hour: TimeManager.formatDate(nextStage.date, 'HH:mm'),
            quantity: nextStage.dispatches[0].attachmentQuantity,
          }
        : { date: '', hour: '', quantity: '' },
    });
    containers.push(container);
  }
  const length = containers.length;

  for (let index = length; index < getLastPageNumber(length); index++) {
    const container = createStageContainer({
      index: index,
      officers: [],
      outDetail: { hour: '', date: '', quantity: '' },
      inDetail: { hour: '', date: '', quantity: '' },
      reference: '',
      internalNumber: '',
    });
    containers.push(container);
  }
  return containers;
}

function getLastPageNumber(lengthData: number): number {
  if (lengthData <= 8) return 8;
  const firstTerm = 3;
  const increment = 5;
  const termsBefore = Math.ceil((lengthData - firstTerm) / increment);
  const nextTerm = firstTerm + termsBefore * increment;
  return nextTerm;
}

function firstSection(procedure: Procedure, workflow?: Workflow) {
  const { emitter, receiver } = procedure.routeMapProps();
  const stage = workflow?.dispatches[0];

  return createDetailContainer({
    code: procedure.code,
    cite: procedure.cite,
    reference: procedure.reference,
    group: procedure.group,
    emitter: {
      fullname: emitter.fullname,
      jobtitle: emitter.jobtitle ?? 'Sin cargo',
    },
    inDetail: {
      date: TimeManager.formatDate(procedure.startDate, 'MM/D/YYYY'),
      hour: TimeManager.formatDate(procedure.startDate, 'HH:mm'),
      quantity: procedure.amount,
    },
    internalNumber: workflow?.dispatches[0].internalNumber ?? '',
    receiver: { jobtitle: '', fullname: '' },
    outDetail: { date: '', hour: '', quantity: '' },
  });
}

async function createHeaderContainer(): Promise<Content> {
  return [
    {
      style: 'cabecera',
      columns: [
        {
          image: await convertImageABase64(
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
          image: await convertImageABase64(
            '../../../assets/img/gams/escudo_sacaba.jpeg'
          ),
          width: 70,
          height: 70,
        },
      ],
    },
  ];
}
function createDetailContainer({
  group,
  code,
  reference,
  inDetail,
  cite,
  emitter,
  receiver,
  outDetail,
  internalNumber,
}: originDetails) {
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
                        text: group[0],
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
                        text: group[1],
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
                      { text: group[2], style: 'header' },
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
                        text: `${code}`,
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
                  `CITE: ${cite}`,
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
                            text: `${internalNumber}`,
                            fontSize: 9,
                            alignment: 'center',
                          },
                        ],
                      ],
                    },
                  },
                ],
                [
                  `REMITENTE: ${emitter.fullname}`,
                  `CARGO: ${emitter.jobtitle}`,
                ],
                [
                  `DESTINATARIO: ${receiver.fullname}`,
                  `CARGO: ${receiver.jobtitle}`,
                ],
                [{ text: `REFERENCIA: ${reference}`, colSpan: 2 }],
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
function createStageContainer({
  index,
  officers,
  reference,
  internalNumber,
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
            text: `DESTINATARIO ${toOrdinal(
              index + 1
            )} (NOMBRE Y CARGO): ${officers.join(' // ')}`,
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
                  { text: internalNumber },
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
