import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProjectFormService } from '../../../core/services/project.services';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { MatButtonModule } from '@angular/material/button';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule
} from '@angular/cdk/drag-drop';

@Component({
  standalone: true,
  selector: 'app-project-kanban',
  imports: [MatButtonModule, CommonModule, DragDropModule, MatDialogModule],
  templateUrl: './project-kanban.component.html',
  styleUrls: ['./project-kanban.component.scss']
})
export class ProjectKanbanComponent implements OnInit {
  projectId!: number;

  // Listas de tareas por estado
  pendientes: any[] = [];
  listas: any[] = [];  
  enProceso: any[] = [];
  finalizadas: any[] = [];
  inconclusas: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectFormService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.projectId = +this.route.snapshot.paramMap.get('id')!;
    this.cargarTareas();
  }

  cargarTareas() {
    this.projectService.obtenerTareasPorProyecto(this.projectId).subscribe(tareas => {
      console.log('Tareas recibidas del backend:', tareas);

      // Asignar tareas según el estado numérico
      this.pendientes = tareas.filter(t => t.estado === 0);
      this.listas = tareas.filter(t => t.estado === 1);
      this.enProceso = tareas.filter(t => t.estado === 2);
      this.finalizadas = tareas.filter(t => t.estado === 3);
      this.inconclusas = tareas.filter(t => t.estado === 4);
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const tarea = event.container.data[event.currentIndex];
      const nuevoEstado = this.getEstadoPorContenedor(event.container.id);

      console.log(`Actualizando tarea ID ${tarea.id} a estado: ${nuevoEstado}`);

      this.projectService.actualizarEstadoTarea(tarea.id, nuevoEstado).subscribe(() => {
        tarea.estado = nuevoEstado; // Actualizar estado localmente
      });
    }
  }

  getEstadoPorContenedor(contenedorId: string): number {
    switch (contenedorId) {
      case 'pendientes-list': return 0;
      case 'listas-list': return 1;
      case 'enproceso-list': return 2;
      case 'finalizadas-list': return 3;
      case 'inconclusas-list': return 4;
      default: return 0;
    }
  }

  abrirModalTarea() {
    this.dialog.open(TaskModalComponent, {
      data: null,
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result) {
        const nuevaTarea = {
          ...result,
          proyectoId: this.projectId,
          estado: 0 // Estado inicial: Pendiente
        };

        this.projectService.crearTarea(nuevaTarea).subscribe((tareaCreada) => {
          console.log('Tarea creada:', tareaCreada);
          switch (tareaCreada.estado) {
            case 0: this.pendientes.push(tareaCreada); break;
            case 1: this.listas.push(tareaCreada); break;
            case 2: this.enProceso.push(tareaCreada); break;
            case 3: this.finalizadas.push(tareaCreada); break;
            case 4: this.inconclusas.push(tareaCreada); break;
            default: this.pendientes.push(tareaCreada);
          }
        });
      }
    });
  }
}
