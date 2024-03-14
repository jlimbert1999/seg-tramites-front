import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavButtonComponent } from '../../../components';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    SidenavButtonComponent,
    MatIconModule,
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent {
  logs = [
    {
      icon: 'home',
      version: '0.0.1',
      group: 'error',
      date: '25/06/2022',
      title: 'Estructura inicial del proyecto',
      descripcion:
        'Configuracion inicial de rutas, controladores, servicios y conexcion con base datos',
      activitys: [
        'Creacion repositorio GitHub',
        'Instalacion de librerias necesarias',
      ],
    },
    {
      icon: 'settings',
      version: '0.0.5',
      group: 'deploy',
      date: '18 /08 /2022',
      title: 'Implementacion de nuevo tipo de tramite',
      descripcion:
        'Modificacion de estructura del proyecto para implementacion de nuevo tipo de tramite',
      activitys: [
        'Creacion vistas, formularios metodos para administracion de tramites internos',
        'Creacion de nueva tabla para tramites internos ',
      ],
    },
    {
      icon: 'build',
      version: '0.1.1',
      group: 'repair',
      date: '1/12/2022',
      title: 'Migracion de base de datos MySQL a MongoDB',
      descripcion:
        'Reestructuracion del proyecto con metodos y servicios para conexion y administracion de esquemas',
      activitys: [
        'Diseño de estructura de base de datos',
        'Creacion de esquemas en MongoDB',
        'Cambios de metodos para consultas',
      ],
    },
    {
      icon: 'settings',
      version: '0.2.0',
      group: 'error',
      date: '2/01/2023',
      title: 'Correcion validaciones en formularos',
      descripcion:
        'Modificar validaciones en formularios de registro con abreviaturas, guiones, espacios en blanco',
      activitys: [
        'Validacion puntos para nombres y apellidos',
        'Remover validacion de apellido materno',
        'Remover campos de expedido',
      ],
    },
    {
      icon: 'settings',
      version: '0.8.0',
      group: 'error',
      date: '28/04/2023',
      title: 'Implementacion de observaciones para tramites',
      descripcion:
        'Creacion de esquemas y relaciones para el registro de observaciones',
      activitys: [
        'Creacion de formulario para registro',
        'Implmentacion de metodos y validaciones para el cambio de estado de los tramites',
      ],
    },
    {
      icon: 'settings',
      version: '0.8.0',
      group: 'error',
      date: '09/05/2023',
      title: 'Implementacion de cancelacion de envios',
      descripcion:
        'Creacion de metodos, validaciones y alertas para eliminacion de envio',
      activitys: [
        'Correcion logica de workflow',
        'Correcion cambio de ubicacion',
        'Implementacion de validacion para tramites aceptados',
      ],
    },
    {
      icon: 'settings',
      version: '0.9.0',
      group: 'error',
      date: '19/05/2023',
      title: 'Implementacion de metodos para desarchivo',
      descripcion:
        'Creacion de metodos para administracion de archivos y generacion de eventos',
      activitys: [
        'Creacion de esquema para archivos en MongoDB',
        'Creacion logica de archivo y desarchivo de tramites',
        'Implementacion logica de creacion de eventos/logs para cada desarchivo',
        'Creacion de vista para la administracion de archivados',
      ],
    },
    {
      icon: 'settings',
      version: '1.0.5',
      group: 'error',
      date: '24/05/2023',
      title: 'Implementacion envio a multiples funcionarios',
      descripcion:
        'Reestructuracion del esquema de base de datos, correccion desarchivo de tramite y cambios en formato hoja de ruta, contenedores fuentes para PDF',
      activitys: [
        'Creacion de nueva estructura de base de datos MongoDB (Modelo estructura de arbol con referencias principales)',
        'Implementacion de nuevo metodo para eliminacion y creacion de esquema bandeja de entrada a esquema de archivos',
        'Correcion en division de celdas para fechas de ingreso y salida en hoja de ruta',
        'Cambio de posicion para instruccion / proveido',
      ],
    },
    {
      icon: 'settings',
      version: '1.1.0',
      group: 'error',
      date: '31/05/2023',
      title: 'Cambio de estilo para "Aniversario de Sacaba 262"',
      descripcion: 'Modificaciones de estilo, fuentes y logo en vistas',
      activitys: [
        'Cambio logo inicial Escudo de Sacaba',
        'Cambio color fondo inicio de sesion y navegacion lateral',
      ],
    },
    {
      icon: 'settings',
      version: '1.9.0',
      group: 'error',
      date: '20/02/2024',
      title:
        'Reestructuracion del proyecto "Seguimiento de tramites internos y externos"',
      descripcion:
        'Reestructuracion del esquema de base de datos, migracion de Frontend, Backend a nueva version de NodeJS ',
      activitys: [
        'Migracion backend (NodeJS - Express) al framework NestJS',
        'Migracion frontend Angular (V.14) a la nueva version Angular (V.17)',
        'Creacion de nuevos metodos para la administracion de envios, archivos y obtencion de workflow',
        'Implementacion de transacciones (ACID) para el esquema de base de datos',
        'Correcion en metodos de busqueda de tramites',
        'Creacion esquema basado en herencia para tramites externo e internos',
      ],
    },
    {
      icon: 'settings',
      version: '2.0.0',
      group: 'error',
      date: '20/02/2024',
      title:
        'Correcion de errores e implementacion nuevas vistas para reportes e informacion',
      descripcion:
        'Implementacion de la vista "Notas de la version", cambios en formato de reportes y correcion en cancelacion de envio inicial',
      activitys: [
        'Implmentacion de menu lateral con reportes disponibles',
        'Implementacion de linea temporal con los cambios realizados',
      ],
    },
  ];
}
