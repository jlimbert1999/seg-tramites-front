import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

interface AlertOptions {
  title: string;
  text?: string;
  icon: 'success' | 'error' | 'warning' | 'info' | 'question';
}

interface QuestionAlertOptions {
  title: string;
  text?: string;
  icon: 'success' | 'error' | 'warning' | 'info' | 'question';
  callback: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}
  Alert({ icon = 'info', title, text }: AlertOptions) {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: 'Aceptar',
    });
  }
  QuestionAlert({ title, text, icon, callback }: QuestionAlertOptions) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }
}
