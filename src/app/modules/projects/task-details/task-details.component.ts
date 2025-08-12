import { Component, Inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { ProjectFormService } from '../../../core/services/project.services';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingSpinnerComponent } from "../../../shared/components/loading-spinner/loading-spinner.component";
import { AuthService } from '../../../core/services/auth.services'; // Importa el servicio de autenticación

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
  usuarioAutenticado = false; // Flag para saber si el usuario está autenticado

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TaskDetailComponent>,
    private tareaService: ProjectFormService,
    private dialog: MatDialog,
    private authService: AuthService, // Inyecta el servicio AuthService
    private cdr: ChangeDetectorRef // Inyecta ChangeDetectorRef para manejar la actualización de vista
  ) {}

  ngOnInit(): void {
    this.tarea = this.data;  // Asigna los datos pasados desde el modal
    this.usuarioAutenticado = this.authService.isLoggedIn();  // Verifica si el usuario está autenticado
  }

  cerrar() {
    this.dialogRef.close();
  }

  // Método para enviar comentario
  enviarComentario() {
    if (!this.nuevoComentario) return;

    if (!this.usuarioAutenticado) {
      console.error("El usuario no está autenticado");
      return; // No dejar enviar comentario si no está autenticado
    }

    this.loading = true;
    this.tareaService.agregarComentario(this.tarea.id, this.nuevoComentario).subscribe({
      next: (comentario) => {
        // Asegúrate de solo agregar lo que necesitas
        this.tarea.comentarios.push({
          usuarioNombre: comentario.usuarioNombre, // Asegúrate de que esto coincida con tu DTO
          comentarioTexto: comentario.comentarioTexto,
          fechaComentario: comentario.fechaComentario
        });
        this.nuevoComentario = '';
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al enviar comentario:', err);
        this.loading = false;
      }
    });
  }

  // Método para editar tarea
  editar() {
  if (!this.usuarioAutenticado) {
    console.error("El usuario no está autenticado");
    return;
  }

  this.dialog.open(TaskModalComponent, {
    data: this.tarea,  
    width: '400px',    
  }).afterClosed().subscribe((actualizada) => {
    if (actualizada) {
      Object.assign(this.tarea, actualizada);  // Actualiza localmente

      // Actualiza la tarea en el backend
      this.loading = true;
      this.tareaService.actualizarTarea(this.tarea.id, this.tarea).subscribe({
        next: (tareaActualizada) => {
          this.tarea = tareaActualizada;  // Actualiza la tarea con la respuesta
          this.loading = false;

          // Cierra el modal y pasa la tarea actualizada
          this.dialogRef.close(tareaActualizada);
        },
        error: (err) => {
          console.error('Error al actualizar la tarea:', err);
          this.loading = false;
        }
      });
    }
  });
}
}