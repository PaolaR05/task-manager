import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';            // <-- Agregado
import { ActivatedRoute } from '@angular/router';
import { ProjectFormService } from '../../../core/services/project.services';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskDetailComponent } from '../task-details/task-details.component';

@Component({
  standalone: true,
  selector: 'app-project-kanban-colaborador',
  templateUrl: './project-kanban-colaborador.component.html',
  styleUrls: ['./project-kanban-colaborador.component.scss'],
  imports: [
    CommonModule,            // <-- Agregar para *ngFor, *ngIf
    DragDropModule,
  ],
})
export class ProjectKanbanColaboradorComponent implements OnInit {

  projectId!: number;
  proceso: any[] = [];
  finalizadas: any[] = [];
  inconclusas: any[] = [];

  connectedLists = [
    'proceso-list',
    'finalizadas-list',
    'inconclusas-list'
  ];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectFormService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.projectService.obtenerTareasPorProyecto(this.projectId).subscribe({
      next: (tareas) => {
        const tareasNormalizadas = tareas.map(t => ({
          id: t.Id,
          descripcion: t.Descripcion,
          prioridad: t.Prioridad ?? 1, // 👈 Asegúrate de que venga del backend
          estado: t.Estado,
          proyectoId: t.ProyectoId,
          comentarios: t.Comentarios || []
        }));

        this.proceso = tareasNormalizadas.filter(t => t.estado === 2);
        this.finalizadas = tareasNormalizadas.filter(t => t.estado === 3);
        this.inconclusas = tareasNormalizadas.filter(t => t.estado === 4);
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error al cargar tareas:', error)
    });
  }

  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const tareaMovida = { ...event.previousContainer.data[event.previousIndex] };
      const nuevoEstado = this.getEstadoPorContenedor(event.container.id);

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.projectService.actualizarEstadoTarea(tareaMovida.id, nuevoEstado).subscribe({
        next: () => {
          tareaMovida.estado = nuevoEstado;
          this.cdr.detectChanges();
        },
        error: () => {
          // revertir movimiento si falla
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
          this.cdr.detectChanges();
        }
      });
    }
  }

  getEstadoPorContenedor(contenedorId: string): number {
    switch (contenedorId) {
      case 'proceso-list': return 2;
      case 'finalizadas-list': return 3;
      case 'inconclusas-list': return 4;
      default: return 0;
    }
  }
getPrioridadTexto(prioridad: number): string {
  switch (prioridad) {
    case 1: return 'Alta';
    case 2: return 'Media';
    case 3: return 'Baja';
    default: return 'Baja';
  }
}

  abrirDetalleTarea(tareaId: number): void {
    this.projectService.obtenerDetalleTarea(tareaId).subscribe({
      next: (detalle) => {
        const tareaNormalizada = {
          id: detalle.Id,
          descripcion: detalle.Descripcion,
          estado: detalle.Estado,
          proyectoId: detalle.ProyectoId,
          comentarios: detalle.Comentarios || [],
        };

        this.dialog.open(TaskDetailComponent, {
          data: tareaNormalizada,
          width: '900px',
          maxWidth: '90vw'
        });
      },
      error: (err) => console.error('Error al obtener detalle de tarea:', err)
    });
  }

  trackById(index: number, tarea: any): number {
    return tarea.id;
  }
}