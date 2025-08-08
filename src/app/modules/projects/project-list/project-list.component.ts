import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProjectFormService } from '../../../core/services/project.services';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  imports: [
    MatButtonModule,
    CommonModule,
    MatCardModule,
    RouterModule
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
    this.projectService.obtenerProyectos().subscribe({
      next: (data) => {
        console.log('Proyectos recibidos:', data);
        this.projects = data;
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
