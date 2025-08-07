import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../../core/services/empresaservices';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

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
    MatIcon,
    FormsModule
  ]
})
export class UserFormComponent implements OnInit {
  userId: number | null = null;
  hidePassword = true; 
  userData = { name: '', lastname: '', email: '', password: '', rol: 'colaborador', empresaId: null };
  roles = ['superadmin', 'admin_empresa', 'colaborador']; 
  empresas: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private userService: UserService,
    private empresaService: EmpresaService
  ) {}

  ngOnInit() {
    // Primero cargamos las empresas
    this.empresaService.getEmpresas().subscribe(empresas => {
      this.empresas = empresas;
      
      // Luego si es edición, cargamos el usuario
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.userId = +params['id'];
          this.userService.getUser(this.userId).subscribe(user => {
            this.userData = user;
          });
        }
      });

    });
  }

  saveUser() {
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
