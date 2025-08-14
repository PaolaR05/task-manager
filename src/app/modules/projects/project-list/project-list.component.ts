import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProjectFormService, ProyectoConAvance } from '../../../core/services/project.services';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  standalone: true,
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  imports: [
    MatButtonModule,
    CommonModule,
    MatCardModule,
    RouterModule,
    MatProgressBarModule
  ]
})
export class ProjectListComponent implements OnInit {
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

  this.projectService.getProyectosConAvance().subscribe({
    next: (data: ProyectoConAvance[]) => {
      console.log('✅ Proyectos recibidos del backend:', data);  // ← IMPORTANTE

this.projects = data.map(p => ({
  id: p.Id,
  nombre: p.Nombre,
  descripcion: p.Descripcion || 'Sin descripción',
  fechaInicio: p.FechaInicio,
  fechaFin: p.FechaFin,
  porcentajeAvance: p.PorcentajeAvance ?? 0
}));



      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error al cargar proyectos', err);
      this.isLoading = false;
    }
  });
}


  verKanban(projectId: number): void {
    this.router.navigate(['/projects', projectId, 'kanban']);
  }

  eliminarProyecto(id: number) {
    if (confirm('¿Seguro que quieres eliminar este proyecto?')) {
      this.projectService.eliminarProyecto(id).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p.Id !== id);
        },
        error: err => {
          console.error(err);
          alert('No se pudo eliminar el proyecto.');
        }
      });
    }
  }
}
