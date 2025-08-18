import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../../core/services/empresaservices';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.services';

interface UserData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  rol: string;
  empresaId: number | null;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    FormsModule
  ]
})
export class UserFormComponent implements OnInit {
  userId: number | null = null;
  hidePassword = true;

  userData: UserData = {
    name: '',
    lastname: '',
    email: '',
    password: '',
    rol: 'colaborador',
    empresaId: null // empieza en null hasta que el usuario seleccione
  };

  roles = ['superadmin', 'admin_empresa', 'colaborador'];
  empresas: any[] = [];


  esAdminEmpresa = false; 
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private userService: UserService,
    private empresaService: EmpresaService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.userSubject.value;

    if (currentUser && currentUser.rol === 'admin_empresa') {
      this.esAdminEmpresa = true;
      this.userData.empresaId = currentUser.empresaId;
    }

    this.empresaService.getEmpresas().subscribe(empresas => {
      this.empresas = empresas.map(e => ({ ...e, id: Number(e.Id) }));

      // Si es admin_empresa → mostrar solo su empresa
      if (this.esAdminEmpresa) {
        this.empresas = this.empresas.filter(e => e.id === this.userData.empresaId);
      }

      // Si es edición, cargar usuario
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.userId = +params['id'];
          this.userService.getUser(this.userId).subscribe(user => {
            this.userData = {
              name: user.Name || '',
              lastname: user.Lastname || '',
              email: user.Email || '',
              password: '',
              rol: user.Rol || 'colaborador',
              empresaId: user.EmpresaId != null ? Number(user.EmpresaId) : this.userData.empresaId
            };
          });
        }
      });
    });
  }

  saveUser(form: NgForm) {
    if (form.invalid) return;

    // Validar empresa seleccionada
    if (this.userData.empresaId == null) {
      alert('Selecciona una empresa');
      return;
    }

    if (this.userId) {
      this.userService.updateUser(this.userId, this.userData).subscribe(() => {
        this.router.navigate(['/users']);
      });
    } else {
      this.userService.createUser(this.userData).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
