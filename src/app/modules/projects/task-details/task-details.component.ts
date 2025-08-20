import { Component, Inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { LoadingSpinnerComponent } from "../../../shared/components/loading-spinner/loading-spinner.component";
import { AuthService } from '../../../core/services/auth.services';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { ProjectFormService } from '../../../core/services/project.services';
import { UserService } from '../../../core/services/user.service';

@Component({
  standalone: true,
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent
  ]
})
export class TaskDetailComponent implements OnInit {
  tarea: any;
  nuevoComentario: string = '';
  loading = false;
  usuarioAutenticado = false;
  archivoSeleccionado: File | null = null;

  usuariosDisponibles: any[] = [];
  usuariosSeleccionados: number[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TaskDetailComponent>,
    private tareaService: ProjectFormService,
    private usuarioService: UserService, 
    private dialog: MatDialog,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

 ngOnInit(): void {

  console.log('📦 DATA ENVIADA AL MODAL:', this.data);

  this.tarea = {
    ...this.data,
    proyectoId: this.data?.proyectoId ?? this.data?.ProyectoId ?? null
  };

  this.usuarioAutenticado = this.authService.isLoggedIn();

  if (!this.tarea.comentarios) this.tarea.comentarios = [];
  if (!this.tarea.adjuntos) this.tarea.adjuntos = [];

  this.tarea.estadoNombre = this.getEstadoNombre(this.tarea.estado);

  if (this.tarea.proyectoId) {
    this.cargarUsuariosAsignados();
    
  } else {
    console.warn('⚠️ No hay proyecto asociado a esta tarea');
  }
}


cargarUsuariosAsignados() {
  const proyectoId = this.tarea.proyectoId ?? this.data.proyectoId ?? null;
  
  if (!proyectoId) {
    console.warn('No hay proyecto asociado a esta tarea');
    return;
  }

  this.tareaService.obtenerColaboradoresPorProyecto(proyectoId).subscribe({
    next: (usuarios) => {
      this.usuariosDisponibles = usuarios;
            console.log('👥 Usuarios disponibles cargados:', this.usuariosDisponibles);  // <-- Aquí el console.log

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error al cargar colaboradores asignados:', err);
    }
  });
}

  asignarColaboradores() {
    if (!this.usuariosSeleccionados.length || !this.tarea?.id) return;

    this.loading = true;
    this.tareaService.asignarColaboradoresATarea(this.tarea.id, this.usuariosSeleccionados).subscribe({
      next: () => {
        this.loading = false;
        this.usuariosSeleccionados = [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al asignar colaboradores:', err);
        this.loading = false;
      }
    });
  }

  cerrar() {
    this.dialogRef.close(this.tarea);
  }

  enviarComentario() {
    if (!this.nuevoComentario.trim() || !this.usuarioAutenticado || !this.tarea?.id) return;

    this.loading = true;
    this.tareaService.agregarComentario(this.tarea.id, this.nuevoComentario).subscribe({
      next: (comentario) => {
        this.tarea.comentarios.push({
          usuarioNombre: comentario.UsuarioNombre ?? 'Desconocido',
          comentarioTexto: comentario.ComentarioTexto,
          fechaComentario: comentario.fechaComentario
        });
        this.nuevoComentario = '';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al enviar comentario:', err);
        this.loading = false;
      }
    });
  }

  editar() {
    if (!this.usuarioAutenticado) return;

    this.dialog.open(TaskModalComponent, {
      data: this.tarea,
      width: '1000px',
    }).afterClosed().subscribe((actualizada) => {
      if (!actualizada) return;

      Object.assign(this.tarea, actualizada);
      this.loading = true;

      this.tareaService.actualizarTarea(this.tarea.id, this.tarea).subscribe({
        next: (tareaActualizada) => {
          this.tarea = tareaActualizada;
          this.tarea.estadoNombre = this.getEstadoNombre(this.tarea.estado);
          this.loading = false;
          this.dialogRef.close(tareaActualizada);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al actualizar la tarea:', err);
          this.loading = false;
        }
      });
    });
  }

  seleccionarArchivo(event: any) {
    this.archivoSeleccionado = event.target.files[0] ?? null;
  }

  subirArchivo() {
    if (!this.archivoSeleccionado || !this.tarea?.id) return;

    this.loading = true;
    const formData = new FormData();
    formData.append('archivo', this.archivoSeleccionado);

    this.tareaService.subirAdjunto(this.tarea.id, formData).subscribe({
      next: (adjunto) => {
        this.tarea.adjuntos.push(adjunto);
        this.archivoSeleccionado = null;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al subir archivo:', err);
        this.loading = false;
      }
    });
  }

  getEstadoNombre(estado: number): string {
    switch (estado) {
      case 0: return 'Pendiente';
      case 1: return 'Listas';
      case 2: return 'En Proceso';
      case 3: return 'Finalizadas';
      case 4: return 'Inconclusas';
      default: return 'Desconocido';
    }
  }
}
