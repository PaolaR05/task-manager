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

  minFechaHoy = new Date();
  minFechaFin: Date | null = null;

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
      prioridad: [data?.prioridad ?? '', Validators.required],
      attachmentRequerido: [data?.attachmentRequerido || false],
      ubicacionRequeridaAlCerrar: [data?.ubicacionRequeridaAlCerrar || false]
    }, { validators: this.fechasValidator });

    // Si ya hay una fecha de inicio, actualizamos minFechaFin para que la fecha fin no pueda ser menor
    if (data?.fechaInicioEstimado) {
      this.minFechaFin = new Date(data.fechaInicioEstimado);
    }
  }

  fechasValidator(group: FormGroup) {
    const inicio = group.get('fechaInicioEstimado')?.value;
    const fin = group.get('fechaFinEstimado')?.value;

    if (inicio && fin && fin < inicio) {
      group.get('fechaFinEstimado')?.setErrors({ fechaFinAntesDeInicio: true });
      return { fechaFinAntesDeInicio: true };
    } else {
      const errors = group.get('fechaFinEstimado')?.errors;
      if (errors) {
        delete errors['fechaFinAntesDeInicio'];
        if (Object.keys(errors).length === 0) {
          group.get('fechaFinEstimado')?.setErrors(null);
        } else {
          group.get('fechaFinEstimado')?.setErrors(errors);
        }
      }
      return null;
    }
  }

  onFechaInicioChange(fecha: Date) {
    this.minFechaFin = fecha;

    const fechaFin = this.tareaForm.get('fechaFinEstimado')?.value;
    if (fechaFin && fechaFin < fecha) {
      this.tareaForm.get('fechaFinEstimado')?.setValue(null);
    }
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
