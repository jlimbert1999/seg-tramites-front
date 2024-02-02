interface TypeProcedureProps {
  _id: string;
  nombre: string;
  segmento: string;
  requerimientos: requirement[];
  tipo: 'INTERNO' | 'EXTERNO';
  activo: boolean;
}
interface requirement {
  nombre: string;
  activo: boolean;
}

export class TypeProcedure {
  public _id: string;
  public nombre: string;
  public segmento: string;
  public requerimientos: requirement[];
  public tipo: 'INTERNO' | 'EXTERNO';
  public activo: boolean;
  constructor({
    _id,
    nombre,
    segmento,
    requerimientos,
    tipo,
    activo,
  }: TypeProcedureProps) {
    this._id = _id;
    this.nombre = nombre;
    this.segmento = segmento;
    this.requerimientos = requerimientos;
    this.tipo = tipo;
    this.activo = activo;
  }
}
