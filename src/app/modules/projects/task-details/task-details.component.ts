import { Component, Inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingSpinnerComponent } from "../../../shared/components/loading-spinner/loading-spinner.component";
import { AuthService } from '../../../core/services/auth.services';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { ProjectFormService } from '../../../core/services/project.services';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TaskDetailComponent>,
    private tareaService: ProjectFormService,
    private dialog: MatDialog,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tarea = this.data;
    this.usuarioAutenticado = this.authService.isLoggedIn();

    if (!this.tarea.comentarios) this.tarea.comentarios = [];
    if (!this.tarea.adjuntos) this.tarea.adjuntos = [];

    // Convertir estado a nombre
    this.tarea.estadoNombre = this.getEstadoNombre(this.tarea.estado);
  }

  cerrar() {
    this.dialogRef.close(this.tarea);
  }

  enviarComentario() {
    if (!this.nuevoComentario.trim() || !this.usuarioAutenticado || !this.tarea?.id) return;

    this.loading = true;

    this.tareaService.agregarComentario(this.tarea.id, this.nuevoComentario)
      .subscribe({
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
      width: '400px',
    }).afterClosed().subscribe((actualizada) => {
      if (!actualizada) return;

      Object.assign(this.tarea, actualizada);
      this.loading = true;

      this.tareaService.actualizarTarea(this.tarea.id, this.tarea)
        .subscribe({
          next: (tareaActualizada) => {
            this.tarea = tareaActualizada;
            // Actualizar nombre del estado
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

    this.tareaService.subirAdjunto(this.tarea.id, formData)
      .subscribe({
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

  // 🔹 Nuevo método para convertir estado numérico a nombre
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
