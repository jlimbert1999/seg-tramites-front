import { officerResponse } from '../../../infraestructure/interfaces';

interface job {
  _id: string;
  nombre: string;
}
interface OfficerProps {
  _id: string;
  nombre: string;
  paterno: string;
  materno: string;
  dni: string;
  telefono: number;
  // direccion: string;
  activo: boolean;
  cargo?: job;
}
export class Officer {
  static officerFromJson(obj: officerResponse) {
    if (typeof obj['cargo'] === 'string') delete obj['cargo'];
    return new Officer({
      _id: obj['_id'],
      nombre: obj['nombre'],
      paterno: obj['paterno'],
      materno: obj['materno'],
      dni: obj['dni']?.toString() ?? '',
      telefono: obj['telefono'],
      // direccion: obj['direccion'],
      activo: obj['activo'],
      cargo: obj['cargo'],
    });
  }
  public _id: string;
  public nombre: string;
  public paterno: string;
  public materno: string;
  public dni: string;
  public telefono: number;
  // public direccion: string;
  public activo: boolean;
  public cargo?: job;

  constructor({
    _id,
    nombre,
    paterno,
    materno,
    dni,
    telefono,
    // direccion,
    activo,
    cargo,
  }: OfficerProps) {
    this._id = _id;
    this.nombre = nombre;
    this.paterno = paterno;
    this.materno = materno;
    this.dni = dni;
    this.telefono = telefono;
    // this.direccion = direccion;
    this.activo = activo;
    this.cargo = cargo;
  }

  get fullname() {
    return `${this.nombre} ${this.paterno} ${this.materno}`;
  }

  get jobtitle() {
    return this.cargo ? this.cargo.nombre : 'SIN CARGO';
  }

  get fullWorkTitle() {
    const titleCaseFullname = this.fullname
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return `${titleCaseFullname} (${this.jobtitle.toUpperCase()})`;
  }
}
