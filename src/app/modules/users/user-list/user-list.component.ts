import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { EmpresaService } from '../../../core/services/empresaservices';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, MatTableModule, MatFormField, MatLabel, MatIcon]
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  empresas: any[] = [];
  displayedColumns = ['id', 'name', 'email', 'rol', 'empresa', 'actions'];
  filterText: string = '';

  constructor(private userService: UserService, private empresaService: EmpresaService) {}

  ngOnInit() {
    this.empresaService.getEmpresas().subscribe(empresas => {
      // Mapear empresas para usar id y nombre
      this.empresas = empresas.map(e => ({ id: e.Id, nombre: e.Nombre }));

      this.userService.getUsers().subscribe(users => {
        this.users = users.map(u => ({
          ...u,
          empresaNombre: this.empresas.find(e => e.id === Number(u.EmpresaId))?.nombre || 'Sin empresa'
        }));
        // Inicializar filteredUsers
        this.filteredUsers = [...this.users];
      });
    });
  }

  applyFilter() {
    const filter = this.filterText.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.Name.toLowerCase().includes(filter) ||
      u.Email.toLowerCase().includes(filter) ||
      u.Rol.toLowerCase().includes(filter) ||
      u.empresaNombre.toLowerCase().includes(filter)
    );
  }

  deleteUser(userId: number) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    this.userService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter(u => u.Id !== userId);
      this.applyFilter(); // Actualizar lista filtrada
    });
  }
}
