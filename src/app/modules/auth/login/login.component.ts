import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.services';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.snackBar.open('¡Login exitoso!', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Usuario o contraseña incorrectos', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
