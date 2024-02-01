interface officer {
  nombre: string;
  paterno: string;
  materno: string;
  dni: number;
  telefono: number;
  direccion: string;
  cargo?: string;
}
export class OfficerDto {
  static FormtoModel(form: any) {
    if (form['cargo'] === '') delete form['cargo'];
    return new OfficerDto({
      nombre: form['nombre'],
      materno: form['materno'],
      paterno: form['paterno'],
      direccion: form['direccion'],
      cargo: form['cargo'],
      telefono: form['telefono'],
      dni: form['dni'],
    });
  }
  nombre: string;
  materno: string;
  paterno: string;
  dni: number;
  telefono: number;
  direccion: string;
  cargo?: string;
  constructor({ nombre, materno, paterno, dni, telefono, direccion, cargo }: officer) {
    this.nombre = nombre;
    this.materno = materno;
    this.paterno = paterno;
    this.dni = dni;
    this.telefono = telefono;
    this.direccion = direccion;
    this.cargo = cargo;
  }
}
