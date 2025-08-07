import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,MatButtonModule // ✅ necesario para mat-dialog-content y mat-dialog-actions
  ]
})
export class TaskDetailComponent {
  tarea: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TaskDetailComponent>
  ) {
    this.tarea = data;
  }

  cerrar() {
    this.dialogRef.close();
  }
}
