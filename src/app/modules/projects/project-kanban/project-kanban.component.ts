import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProjectFormService } from '../../../core/services/project.services';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule
} from '@angular/cdk/drag-drop';
import { TaskDetailComponent } from '../task-details/task-details.component';

@Component({
  standalone: true,
  selector: 'app-project-kanban',
  imports: [MatIconModule, MatButtonModule, CommonModule, DragDropModule, MatDialogModule],
  templateUrl: './project-kanban.component.html',
  styleUrls: ['./project-kanban.component.scss']
})
export class ProjectKanbanComponent implements OnInit {

  projectId!: number;

  pendientes: any[] = [];
  listas: any[] = [];
  enProceso: any[] = [];
  finalizadas: any[] = [];
  inconclusas: any[] = [];

  connectedLists = [
    'pendientes-list',
    'listas-list',
    'enproceso-list',
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
    this.projectId = +this.route.snapshot.paramMap.get('id')!;
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.projectService.obtenerTareasPorProyecto(this.projectId).subscribe({
      next: (tareas) => {
        const tareasNormalizadas = tareas.map(t => ({
        id: t.Id,
        titulo: t.Titulo,
        descripcion: t.Descripcion,
        estado: t.Estado,
        proyectoId: t.ProyectoId,
        ubicacion: t.Ubicacion,
        fechaInicioEstimado: t.FechaInicioEstimado,
        fechaFinEstimado: t.FechaFinEstimado,
        comentarios: t.Comentarios || []  
        }));

        console.log('Tareas normalizadas recibidas:', tareasNormalizadas);

        this.pendientes = tareasNormalizadas.filter(t => t.estado === 0);
        this.listas = tareasNormalizadas.filter(t => t.estado === 1);
        this.enProceso = tareasNormalizadas.filter(t => t.estado === 2);
        this.finalizadas = tareasNormalizadas.filter(t => t.estado === 3);
        this.inconclusas = tareasNormalizadas.filter(t => t.estado === 4);
      },
      error: (error) => {
        console.error('Error al cargar tareas:', error);
      }
    });
  }

  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.reasignarLista(event.container.id);
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

          this.reasignarLista(event.previousContainer.id);
          this.reasignarLista(event.container.id);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al actualizar estado:', error);

          // Revertir cambio visual si falla
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );

          this.reasignarLista(event.container.id);
          this.reasignarLista(event.previousContainer.id);
          this.cdr.detectChanges();
        }
      });
    }
  }

  abrirModalTarea(): void {
    this.dialog.open(TaskModalComponent, {
      data: null,
      width: '400px'
    }).afterClosed().subscribe({
      next: (result) => {
        if (result) {
          const nuevaTarea = {
            ProyectoId: this.projectId,
            Descripcion: result.descripcion || '',
            Ubicacion: result.ubicacion || null,
            FechaInicioEstimado: result.fechaInicioEstimado || null,
            FechaFinEstimado: result.fechaFinEstimado || null,
            Prioridad: result.prioridad !== undefined ? result.prioridad : 1,
            AttachmentRequerido: result.attachmentRequerido || false,
            UbicacionRequeridaAlCerrar: result.ubicacionRequeridaAlCerrar || false
          };

          this.projectService.crearTarea(nuevaTarea).subscribe({
            next: (tareaCreada) => {
              this.pendientes.push(tareaCreada);
              this.reasignarLista('pendientes-list');
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error al crear tarea:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error al cerrar modal:', err);
      }
    });
  }

  editarTarea(tarea: any): void {
    this.dialog.open(TaskModalComponent, {
      data: tarea,
      width: '400px'
    }).afterClosed().subscribe({
      next: (result) => {
        if (result) {
          const tareaActualizada = {
            Descripcion: result.descripcion || '',
            Ubicacion: result.ubicacion || null,
            FechaInicioEstimado: result.fechaInicioEstimado || null,
            FechaFinEstimado: result.fechaFinEstimado || null,
            Prioridad: result.prioridad !== undefined ? result.prioridad : 1,
            AttachmentRequerido: result.attachmentRequerido || false,
            UbicacionRequeridaAlCerrar: result.ubicacionRequeridaAlCerrar || false
          };

          this.projectService.actualizarTarea(tarea.id, tareaActualizada).subscribe({
            next: (tareaEditada) => {
              this.actualizarTareaEnListas(tareaEditada);
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error al actualizar tarea:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error al cerrar modal de edición:', err);
      }
    });
  }

  actualizarTareaEnListas(tareaActualizada: any): void {
    const listas = [this.pendientes, this.listas, this.enProceso, this.finalizadas, this.inconclusas];
    for (const lista of listas) {
      const index = lista.findIndex(t => t.id === tareaActualizada.id);
      if (index !== -1) {
        lista[index] = { ...lista[index], ...tareaActualizada };
        break;
      }
    }
  }

  moverTareaDeEstado(tarea: any, estadoAnterior: number, estadoNuevo: number) {
    this.quitarTareaDeLista(tarea.id, estadoAnterior);

    tarea.estado = estadoNuevo;

    switch (estadoNuevo) {
      case 0: this.pendientes.push(tarea); break;
      case 1: this.listas.push(tarea); break;
      case 2: this.enProceso.push(tarea); break;
      case 3: this.finalizadas.push(tarea); break;
      case 4: this.inconclusas.push(tarea); break;
    }

    this.reasignarLista(this.getListaIdPorEstado(estadoAnterior));
    this.reasignarLista(this.getListaIdPorEstado(estadoNuevo));
    this.cdr.detectChanges();
  }

  quitarTareaDeLista(tareaId: number, estado: number) {
    let lista = this.getListaPorEstado(estado);
    const index = lista.findIndex(t => t.id === tareaId);
    if (index > -1) lista.splice(index, 1);
  }

  getListaPorEstado(estado: number) {
    switch (estado) {
      case 0: return this.pendientes;
      case 1: return this.listas;
      case 2: return this.enProceso;
      case 3: return this.finalizadas;
      case 4: return this.inconclusas;
      default: return this.pendientes;
    }
  }

  getListaIdPorEstado(estado: number): string {
    switch (estado) {
      case 0: return 'pendientes-list';
      case 1: return 'listas-list';
      case 2: return 'enproceso-list';
      case 3: return 'finalizadas-list';
      case 4: return 'inconclusas-list';
      default: return 'pendientes-list';
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

  reasignarLista(listaId: string): void {
    switch (listaId) {
      case 'pendientes-list':
        this.pendientes = [...this.pendientes];
        break;
      case 'listas-list':
        this.listas = [...this.listas];
        break;
      case 'enproceso-list':
        this.enProceso = [...this.enProceso];
        break;
      case 'finalizadas-list':
        this.finalizadas = [...this.finalizadas];
        break;
      case 'inconclusas-list':
        this.inconclusas = [...this.inconclusas];
        break;
    }
  }

  trackById(index: number, tarea: any): number {
    return tarea.id;
  }

  eliminarTarea(tarea: any, estado: number): void {
    console.log('Eliminar tarea con id:', tarea.id);
    if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;

    this.projectService.eliminarTarea(tarea.id).subscribe({
      next: () => {
        this.quitarTareaDeLista(tarea.id, estado);
        this.reasignarLista(this.getListaIdPorEstado(estado));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al eliminar tarea:', err);
      }
    });
  }

abrirDetalleTarea(tareaId: number): void {
  this.projectService.obtenerDetalleTarea(tareaId).subscribe({
    next: (detalle) => {
      const tareaNormalizada = {
        id: detalle.Id,
        descripcion: detalle.Descripcion,
        ubicacion: detalle.Ubicacion,
        estado: detalle.Estado,
        proyectoId: detalle.ProyectoId,
        fechaInicioEstimado: detalle.FechaInicioEstimado,
        fechaFinEstimado: detalle.FechaFinEstimado,
        comentarios: detalle.Comentarios || []
      };

      this.dialog.open(TaskDetailComponent, {
        data: tareaNormalizada,
        width: '900px',
        maxWidth: '90vw'
      });
    },
    error: (err) => {
      console.error('Error al obtener detalle de tarea:', err);
    }
  });
}

}


