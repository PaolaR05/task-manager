import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectFormService } from '../../../core/services/project.services';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  stepperForm: FormGroup;
  colaboradores: any[] = [];
  seleccionados: number[] = [];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectFormService,
    private router: Router
  ) {
    this.stepperForm = this.fb.group({
      paso1: this.fb.group({
        nombre: ['', Validators.required],
        descripcion: ['']
      }),
      paso2: this.fb.group({
        fechaInicio: [''],
        fechaFin: ['']
      }),
      paso3: this.fb.group({
        colaboradores: [[]]
      })
    });
  }

  ngOnInit(): void {
    this.cargarColaboradores();
  }

  get paso1Group(): FormGroup {
    return this.stepperForm.get('paso1') as FormGroup;
  }

  get paso2Group(): FormGroup {
    return this.stepperForm.get('paso2') as FormGroup;
  }

  get paso3Group(): FormGroup {
    return this.stepperForm.get('paso3') as FormGroup;
  }

  cargarColaboradores() {
    this.projectService.obtenerColaboradoresDisponibles().subscribe(data => {
    console.log('Colaboradores recibidos:', data);
      this.colaboradores = data;
    });
  }

  toggleColaborador(id: number, event: any) {
    if (event.checked) {
      this.seleccionados.push(id);
    } else {
      this.seleccionados = this.seleccionados.filter(x => x !== id);
    }
    this.stepperForm.get('paso3.colaboradores')?.setValue(this.seleccionados);
  }

  crearProyecto() {
    if (this.stepperForm.valid) {
      const paso1 = this.paso1Group.value;
      const paso2 = this.paso2Group.value;
      const paso3 = this.paso3Group.value;

      const proyectoDto = {
        nombre: paso1.nombre,
        descripcion: paso1.descripcion,
        fechaInicio: paso2.fechaInicio,
        fechaFin: paso2.fechaFin
      };

      this.projectService.crearProyecto(proyectoDto).subscribe((res: any) => {
        const proyectoId = res.id || res.Id;

        if (paso3.colaboradores.length > 0) {
          this.projectService.asignarColaboradores({
            proyectoId,
            usuarioIds: paso3.colaboradores
          }).subscribe(() => {
            this.router.navigate(['/projects', proyectoId, 'kanban']);
          });
        } else {
          this.router.navigate(['/projects', proyectoId, 'kanban']);
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/projects']);
  }
}
