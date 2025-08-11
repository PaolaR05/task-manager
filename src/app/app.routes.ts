import { Routes } from '@angular/router';
import { authGuard } from '../app/core/guards/auth.guard';
import { MainComponent } from './layout/main/main.component';
import { LoginComponent } from './modules/auth/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainComponent,
    canActivate: [authGuard], 
    children: [
      { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'projects', loadChildren: () => import('./modules/projects/projects.module').then(m => m.ProjectsModule) },
      { path: 'companies', loadChildren: () => import('./modules/companies/companies.module').then(m => m.CompaniesModule) },
      { path: 'users', loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'customers', loadChildren: () => import('./modules/customers/customers.module').then(m => m.CustomersModule) 
}
    ]
  },
  { path: '**', redirectTo: '' }
];
