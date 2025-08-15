import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { NgIf } from '@angular/common';
import { AuthService, User } from '../../core/services/auth.services';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    NgIf
  ]
})
export class MainComponent implements OnInit {
  user: User | null = null;

  constructor(public auth: AuthService) {}

  ngOnInit() {
    
    this.user = this.auth.userSubject.value;
    console.log('Usuario actual:', this.user); //confirmar que me esta tirando la info completa
    
    this.auth.user$.subscribe(u => {
      this.user = u;
    });
  }

  logout() {
    this.auth.logout();
  }
}
