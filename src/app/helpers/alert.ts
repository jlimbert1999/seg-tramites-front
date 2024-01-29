import Swal from 'sweetalert2';

interface AlertOptions {
  title: string;
  text?: string;
  icon: 'success' | 'error' | 'warning' | 'info' | 'question';
}
export class Alert {
  static showAlert({ icon = 'info', title, text }: AlertOptions) {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: 'Aceptar',
    });
  }
}
