import { UserService } from '../../../core/services/user.service';
import { EmpresaService } from '../../../core/services/empresaservices';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [MatTableModule, MatButtonModule, RouterModule]
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  empresas: any[] = [];
  displayedColumns = ['id', 'name', 'email', 'rol', 'empresa', 'actions'];

  constructor(
    private userService: UserService,
    private empresaService: EmpresaService
  ) {}

  ngOnInit() {
    this.empresaService.getEmpresas().subscribe(empresas => {
      console.log('Empresas crudas:', empresas); // <-- Log inicial

      // Mapeo para adaptar mayúsculas a minúsculas
      this.empresas = empresas.map(e => ({
        id: e.Id,
        nombre: e.Nombre,
        descripcion: e.Descripcion
      }));

      console.log('Empresas procesadas:', this.empresas); // <-- Log después del mapeo

      this.loadUsers();
    });
  }

  loadUsers() {
  this.userService.getUsers().subscribe(users => {
    console.log('Usuarios recibidos:', users); // para confirmar estructura

    this.users = users.map(u => ({
      ...u,
      empresaNombre: this.empresas.find(e => e.id == u.EmpresaId)?.nombre || '-'
    }));
  });
}

  deleteUser(userId: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
