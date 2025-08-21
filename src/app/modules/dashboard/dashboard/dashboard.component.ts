import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ProjectFormService, Proyecto, Tarea } from '../../../core/services/project.services';
import { DashboardService, ProyectoConAvanceDto } from '../../../core/services/Dashboardservices';

import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { MatListItem, MatList } from "@angular/material/list";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { CommonModule } from '@angular/common';

import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

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
     MatProgressSpinner, FullCalendarModule,
    NgChartsModule
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

  proyectosConAvance: ProyectoConAvanceDto[] = [];
  
  // Configuración de la gráfica
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // Para que se ajuste a la card
    scales: {
      y: {
        min: 0,
        max: 100, // Mostrar hasta 100%
        ticks: {
          callback: (value) => value + '%'
        },
        title: {
          display: true,
          text: 'Avance (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Proyectos'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}%`
        }
      }
    }
  };

  public barChartLabels: string[] = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Avance (%)', backgroundColor: '#3f51b5' }
    ]
  };

  constructor(
    private projectService: ProjectFormService,
    private dashboardService: DashboardService 
  ) {}

  ngOnInit(): void {
    this.obtenerPerfilUsuario();
    this.cargarCalendario();
    this.cargarTotales();
    this.cargarProyectosConAvance();
  }

  obtenerPerfilUsuario(): void {
    this.dashboardService.obtenerPerfil().subscribe(
      perfil => this.rolUsuario = perfil?.Rol?.toLowerCase() || '',
      error => {
        console.error('No se pudo obtener el perfil del usuario', error);
        this.rolUsuario = '';
      }
    );
  }

  cargarTotales(): void {
    this.dashboardService.obtenerTotalProyectos().subscribe(total => this.totalProyectos = total, err => this.totalProyectos = 0);
    this.dashboardService.obtenerTotalColaboradores().subscribe(total => this.totalColaboradores = total, err => this.totalColaboradores = 0);
    this.dashboardService.obtenerTotalEmpresas().subscribe(total => this.totalEmpresas = total, err => this.totalEmpresas = 0);
    this.dashboardService.obtenerTotalClientes().subscribe(total => this.totalClientes = total, err => this.totalClientes = 0);
  }

  cargarCalendario(): void {
    this.projectService.obtenerProyectos().subscribe(
      proyectos => {
        this.proyectos = proyectos || [];
        const eventos = proyectos.flatMap(proyecto => 
          proyecto.tareas?.map((tarea: Tarea) => ({
            title: tarea.descripcion,
            date: tarea.fechaInicioEstimado,
            description: tarea.descripcion
          })) || []
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
        this.loading = false;
      },
      error => {
        console.error('Error al cargar proyectos:', error);
        this.error = 'Error al cargar proyectos, por favor intenta más tarde.';
        this.loading = false;
      }
    );
  }

  cargarProyectosConAvance(): void {
    this.projectService.getProyectosConAvance().subscribe(
      data => {
        console.log('📊 Datos recibidos:', data);

        this.proyectosConAvance = data.map(p => ({
          id: p.Id,
          nombre: p.Nombre,
          descripcion: p.Descripcion || '',
          fechaInicio: p.FechaInicio || '',
          fechaFin: p.FechaFin || '',
          porcentajeAvance: p.PorcentajeAvance
        }));

        // Actualizamos la gráfica
        this.barChartLabels = this.proyectosConAvance.map(p => p.nombre);
        this.barChartData = {
          labels: this.barChartLabels,
          datasets: [
            {
              data: this.proyectosConAvance.map(p => p.porcentajeAvance),
              label: 'Avance (%)',
              backgroundColor: '#3f51b5'
            }
          ]
        };
      },
      error => console.error('Error al cargar proyectos con avance', error)
    );
  }
}
