// project-list-colaborador.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectFormService, ProyectoConAvance, ProyectoConTareas } from '../../../core/services/project.services';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';



@Component({
  standalone: true,
  selector: 'app-project-list-colaborador',
  templateUrl: './project-list-colaborador.component.html',
  styleUrls: ['./project-list-colaborador.component.scss'],
  imports: [
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatProgressBarModule
  ]
})
export class ProjectListColaboradorComponent implements OnInit {
  projects: any[] = [];
  isLoading = true;

  constructor(
    private projectService: ProjectFormService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;

this.projectService.obtenerProyectosAsignados().subscribe({
  next: (data: ProyectoConTareas[]) => {
    console.log('Datos recibidos:', data);
    this.projects = data.map(p => ({
      id: p.Id,
      nombre: p.Nombre,
      descripcion: p.Descripcion || 'Sin descripción',
      fechaInicio: p.FechaInicio,
      fechaFin: p.FechaFin,
      tareas: p.Tareas
    }));
    this.isLoading = false;
  },
  error: (err) => {
    console.error('Error al cargar proyectos asignados', err);
    this.isLoading = false;
  }
});

  }

  verKanban(projectId: number): void {
  this.router.navigate(['/projects/colaborador', projectId, 'kanban']);
}

}
