import { Officer } from '../../../domain/models';
import { officer } from '../interfaces/officer.interface';

export class OfficerMapper {
  static fromResponse(response: officer): Officer {
    return new Officer({
      _id: response['_id'],
      nombre: response['nombre'],
      paterno: response['paterno'],
      materno: response['materno'],
      dni: response['dni']?.toString() ?? '',
      telefono: response['telefono'],
      activo: response['activo'],
    });
  }
}
