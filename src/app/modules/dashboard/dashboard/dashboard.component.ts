import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ProjectFormService, Proyecto, Tarea } from '../../../core/services/project.services';
import { DashboardService } from '../../../core/services/Dashboardservices';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { MatListItem, MatList } from "@angular/material/list";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { CommonModule } from '@angular/common';
import es from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule, 
    MatCard, MatCardHeader, MatCardTitle, MatCardContent, 
    MatListItem, MatList, MatProgressSpinner, FullCalendarModule
  ],
})
export class DashboardComponent implements OnInit {

  calendarOptions: any;
  loading: boolean = true;
  proyectos: Proyecto[] = [];
  error: string | null = null;

  totalProyectos: number = 0;
  totalColaboradores: number = 0;
  totalEmpresas: number = 0;
  totalClientes: number = 0;
  rolUsuario: string = '';

  constructor(
    private projectService: ProjectFormService,
    private dashboardService: DashboardService 
  ) {}

  ngOnInit(): void {
    this.obtenerPerfilUsuario();
    this.cargarCalendario();
    this.cargarTotales();
  }

  obtenerPerfilUsuario(): void {
    this.dashboardService.obtenerPerfil().subscribe(
      perfil => {
        if (perfil && perfil.Rol) {
          this.rolUsuario = perfil.Rol.toLowerCase(); // Normalizamos a minúsculas
        } else {
          console.warn('El perfil no tiene rol definido');
          this.rolUsuario = '';
        }
      },
      error => {
        console.error('No se pudo obtener el perfil del usuario', error);
        this.rolUsuario = '';
      }
    );
  }

  cargarTotales(): void {
    this.dashboardService.obtenerTotalProyectos().subscribe(
      total => this.totalProyectos = total,
      err => this.totalProyectos = 0
    );

    this.dashboardService.obtenerTotalColaboradores().subscribe(
      total => this.totalColaboradores = total,
      err => this.totalColaboradores = 0
    );

    this.dashboardService.obtenerTotalEmpresas().subscribe(
      total => this.totalEmpresas = total,
      err => this.totalEmpresas = 0
    );

    this.dashboardService.obtenerTotalClientes().subscribe(
      total => this.totalClientes = total,
      err => this.totalClientes = 0
    );
  }

  cargarCalendario(): void {
    this.projectService.obtenerProyectos().subscribe(
      (proyectos) => {
        if (proyectos && Array.isArray(proyectos) && proyectos.length > 0) {
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
            locale: es,
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay'
            },
            plugins: [dayGridPlugin],
          };
        } else {
          this.error = 'No se encontraron proyectos.';
        }

        this.loading = false;
      },
      (error) => {
        this.error = 'Error al cargar proyectos, por favor intenta de nuevo más tarde.';
        console.error('Error al cargar proyectos:', error);
        this.loading = false;
      }
    );
  }
}
