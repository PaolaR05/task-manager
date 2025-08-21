import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

// Material modules usados en el template
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';  // Para que funcione el datepicker con fechas nativas
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';  // Opcional, si usas íconos

import { ProjectFormService } from '../../../core/services/project.services';

@Component({
  standalone: true,
  selector: 'app-project-form-dialog',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule
  ]
})
export class ProjectFormDialogComponent {
  stepperForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectFormService,
    private router: Router,
    private dialogRef: MatDialogRef<ProjectFormDialogComponent>
  ) {
    this.stepperForm = this.fb.group({
      paso1: this.fb.group({
        nombre: ['', Validators.required],
        descripcion: ['']
      }),
      paso2: this.fb.group({
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required]
      })
    });
  }

  get paso1Group() {
    return this.stepperForm.get('paso1') as FormGroup;
  }

  get paso2Group() {
    return this.stepperForm.get('paso2') as FormGroup;
  }

  crearProyecto() {
    if (this.stepperForm.valid) {
      const paso1 = this.paso1Group.value;
      const paso2 = this.paso2Group.value;

      const proyectoDto = {
        nombre: paso1.nombre,
        descripcion: paso1.descripcion,
        fechaInicio: paso2.fechaInicio,
        fechaFin: paso2.fechaFin
      };

      this.projectService.crearProyecto(proyectoDto).subscribe({
        next: (res: any) => {
          const proyectoId = res.id || res.Id;
          this.dialogRef.close(proyectoId);
          this.router.navigate(['/projects', proyectoId, 'kanban']);
        },
        error: (err) => console.error('Error creando proyecto:', err)
      });
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
