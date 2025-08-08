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
    { value: 0, label: 'Baja' },
    { value: 1, label: 'Media' },
    { value: 2, label: 'Alta' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tareaForm = this.fb.group({
      descripcion: [data?.descripcion || '', Validators.required],
      ubicacion: [data?.ubicacion || ''],
      fechaInicioEstimado: [data?.fechaInicioEstimado ? new Date(data.fechaInicioEstimado) : null],
      fechaFinEstimado: [data?.fechaFinEstimado ? new Date(data.fechaFinEstimado) : null],
      prioridad: [typeof data?.prioridad === 'number' ? data.prioridad : 1, Validators.required], // 1 = Media
      attachmentRequerido: [data?.attachmentRequerido || false],
      ubicacionRequeridaAlCerrar: [data?.ubicacionRequeridaAlCerrar || false]
    });
  }

  guardar() {
    if (this.tareaForm.invalid) return;

    const formValue = this.tareaForm.value;

    this.dialogRef.close({
      descripcion: formValue.descripcion,
      ubicacion: formValue.ubicacion,
      fechaInicioEstimado: formValue.fechaInicioEstimado ? formValue.fechaInicioEstimado.toISOString() : null,
      fechaFinEstimado: formValue.fechaFinEstimado ? formValue.fechaFinEstimado.toISOString() : null,
      prioridad: formValue.prioridad,
      attachmentRequerido: formValue.attachmentRequerido,
      ubicacionRequeridaAlCerrar: formValue.ubicacionRequeridaAlCerrar
    });
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
