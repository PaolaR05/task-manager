import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  standalone: true,
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ]
})
export class TaskModalComponent {
  tareaForm: FormGroup;

  prioridades = [
    { value: 'Baja', label: 'Baja' },
    { value: 'Media', label: 'Media' },
    { value: 'Alta', label: 'Alta' }
  ];

  estados = [
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Lista', label: 'Lista' },
    { value: 'EnProceso', label: 'En Proceso' },
    { value: 'Finalizada', label: 'Finalizada' },
    { value: 'Inconclusa', label: 'Inconclusa' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Puede ser null para nueva tarea o un objeto para edición
  ) {
    this.tareaForm = this.fb.group({
      descripcion: [data?.descripcion || '', Validators.required],
      ubicacion: [data?.ubicacion || ''],
      fechaInicioEstimado: [data?.fechaInicioEstimado ? new Date(data.fechaInicioEstimado) : ''],
      fechaFinEstimado: [data?.fechaFinEstimado ? new Date(data.fechaFinEstimado) : ''],
      prioridad: [data?.prioridad || 'Media', Validators.required],
      attachmentRequerido: [data?.attachmentRequerido || false],
      ubicacionRequeridaAlCerrar: [data?.ubicacionRequeridaAlCerrar || false],
      estado: [data?.estado || 'Pendiente']
    });
  }

  guardar() {
    if (this.tareaForm.valid) {
      this.dialogRef.close(this.tareaForm.value);
    }
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
