import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ProjectFormService, Proyecto, Tarea } from '../../../core/services/project.services';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { MatListItem, MatList } from "@angular/material/list";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { CommonModule } from '@angular/common';
import es from '@fullcalendar/core/locales/es';  // Importa el idioma español correctamente
import dayGridPlugin from '@fullcalendar/daygrid';  // Asegúrate de importar el plugin

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatListItem, MatList, MatProgressSpinner, FullCalendarModule],
})
export class DashboardComponent implements OnInit {

  calendarOptions: any;
  loading: boolean = true;
  proyectos: Proyecto[] = [];  // Lista de proyectos
  error: string | null = null;  // Manejo de errores
totalColaboradores: any;
totalEmpresas: any;
totalClientes: any;

  constructor(private projectService: ProjectFormService) {}

  ngOnInit(): void {
    this.cargarCalendario();
  }

  cargarCalendario(): void {
    this.projectService.obtenerProyectos().subscribe(
      (proyectos) => {
        if (proyectos && Array.isArray(proyectos) && proyectos.length > 0) {
          // Si proyectos es un array y tiene elementos
          this.proyectos = proyectos;
          const eventos = proyectos.flatMap(proyecto => 
            proyecto.tareas ? proyecto.tareas.map((tarea: Tarea) => ({
              title: tarea.descripcion,
              date: tarea.fechaInicioEstimado,
              description: tarea.descripcion
            })) : []
          );
          
          this.calendarOptions = {
            initialView: 'dayGridMonth',
            events: eventos,
            locale: es,  // Establecer el idioma a español
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay'
            },
            plugins: [dayGridPlugin],  // Asegúrate de que el plugin de dayGrid esté cargado
          };
        } else {
          this.error = 'No se encontraron proyectos.';
        }

        this.loading = false;  // Fin de la carga
      },
      (error) => {
        this.error = 'Error al cargar proyectos, por favor intenta de nuevo más tarde.';
        console.error('Error al cargar proyectos:', error);
        this.loading = false;  // Fin de la carga en caso de error
      }
    );
  }
}
