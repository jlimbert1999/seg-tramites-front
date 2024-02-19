interface TypeProcedureProps {
  nombre: string;
  segmento: string;
  tipo: string;
  requerimientos: requirement[];
}
interface requirement {
  nombre: string;
  activo: boolean;
}
export class TypeProcedureDto {
  nombre: string;
  segmento: string;
  tipo: string;
  requerimientos: requirement[];
  static FormToModel(form: any) {
    return new TypeProcedureDto({
      nombre: form['nombre'],
      segmento: form['segmento'],
      tipo: form['tipo'],
      requerimientos: form['requerimientos'],
    });
  }
  constructor({ nombre, segmento, tipo, requerimientos }: TypeProcedureProps) {
    this.nombre = nombre;
    this.segmento = segmento;
    this.tipo = tipo;
    this.requerimientos = requerimientos;
  }
}
