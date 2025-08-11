import { Component, Inject } from '@angular/core';
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
export class TaskDetailComponent {
  tarea: any;
  nuevoComentario: string = '';
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TaskDetailComponent>,
    private tareaService: ProjectFormService,
    private dialog: MatDialog
  ) {
    this.tarea = data;
  }

  cerrar() {
    this.dialogRef.close();
  }

enviarComentario() {
  if (!this.nuevoComentario) return;

  this.loading = true;
  this.tareaService.agregarComentario(this.tarea.id, this.nuevoComentario).subscribe({
    next: (comentario) => {
      this.tarea.comentarios.push(comentario);
      this.nuevoComentario = '';
      this.loading = false;
    },
    error: (err) => {
      console.error('Error al enviar comentario:', err);
      this.loading = false;
    }
  });
}


  editar() {
    this.dialog.open(TaskModalComponent, {
      data: this.tarea
    }).afterClosed().subscribe((actualizada) => {
      if (actualizada) {
        Object.assign(this.tarea, actualizada); // Actualiza localmente
      }
    });
  }
}
