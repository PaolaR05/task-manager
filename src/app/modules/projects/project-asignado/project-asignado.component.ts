import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { ProjectFormService } from '../../../core/services/project.services';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-project-asignado',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatIcon
],
  templateUrl: './project-asignado.component.html'
})
export class ProjectAsignadoComponent implements OnInit {
  asignados: any[] = [];
  disponibles: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number },
    private dialogRef: MatDialogRef<ProjectAsignadoComponent>,
    private projectService: ProjectFormService
  ) {}

ngOnInit(): void {
  const { projectId } = this.data;
  this.projectService.obtenerColaboradoresPorProyecto(projectId).subscribe({
    next: (list) => this.asignados = list,
    error: (err) => console.error('Error cargando asignados:', err)
  });

  this.projectService.obtenerColaboradoresDisponibles(projectId).subscribe({
    next: (list) => this.disponibles = list,
    error: (err) => console.error('Error cargando disponibles:', err)
  });
}


  cancelar(): void {
    this.dialogRef.close();
  }

  agregar(selected: any[]): void {
    const ids = selected.map(o => o.value);
    if (!ids.length) return;

    this.projectService.asignarColaboradores({
      proyectoId: this.data.projectId,
      usuarioIds: ids
    }).subscribe({
      next: () => this.dialogRef.close({ actualizado: true }),
      error: (err) => {
        console.error('Error agregando colaboradores:', err);
        this.dialogRef.close({ actualizado: false });
      }
    });
  }

  quitarColaborador(usuarioId: number) {
  const proyectoId = this.data.projectId; // o desde donde tengas el id

  this.projectService.eliminarColaborador(proyectoId, usuarioId).subscribe({
    next: () => {
      this.asignados = this.asignados.filter(u => u.id !== usuarioId);
      this.dialogRef.close({ actualizado: false });
    },
    error: (err) => console.error('Error eliminando colaborador:', err)
    
  });
}

}
