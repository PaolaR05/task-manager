import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService, Cliente } from '../../../core/services/customerservices';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class CustomerFormComponent implements OnInit {
  clienteId: number | null = null;
  clienteData: Partial<Cliente> = {
    Nombre: '',
    Correo: '',
    Telefono: '',
    EmpresaId: 0 // si la manejas en frontend, o la sacas del backend con el token
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.clienteId = +params['id'];
        this.customerService.getClienteById(this.clienteId).subscribe(cliente => {
          this.clienteData = cliente;
        });
      }
    });
  }

  saveCliente(): void {
    if (this.clienteId) {
      this.customerService.actualizarCliente(this.clienteId, this.clienteData as Cliente)
        .subscribe(() => {
          this.router.navigate(['/customers']);
        });
    } else {
      this.customerService.crearCliente(this.clienteData as Cliente)
        .subscribe(() => {
          this.router.navigate(['/customers']);
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/customers']);
  }
}
