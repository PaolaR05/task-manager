import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../core/services/customerservices';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  standalone: true,
  imports: [MatTableModule, MatButtonModule, RouterModule]
})
export class CustomerListComponent implements OnInit {
  clientes: any[] = [];
  displayedColumns = ['id', 'nombre', 'correo', 'telefono', 'actions'];

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.customerService.getClientes().subscribe({
      next: (data) => {
        console.log('Clientes recibidos:', data);
        this.clientes = data; // aquí dejamos tal cual vienen con mayúsculas
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      }
    });
  }

  eliminarCliente(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este cliente?')) return;

    this.customerService.eliminarCliente(id).subscribe({
      next: () => {
        this.clientes = this.clientes.filter(c => c.Id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar cliente:', err);
      }
    });
  }
}
