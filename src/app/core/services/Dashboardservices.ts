import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  // Total de colaboradores
  obtenerTotalColaboradores(): Observable<number> {
    return this.http.get<number>('/api/usuarios/total-colaboradores'); 
  }

  // Total de empresas
  obtenerTotalEmpresas(): Observable<number> {
    return this.http.get<number>('/api/empresas/total'); 
  }

  // Total de clientes
  obtenerTotalClientes(): Observable<number> {
    return this.http.get<number>('/api/clientes/total'); 
  }

  // Total de proyectos
  obtenerTotalProyectos(): Observable<number> {
    return this.http.get<number>('/api/proyectos/total'); 
  }

  // Obtener perfil del usuario
  obtenerPerfil(): Observable<any> {
    return this.http.get<any>('/api/usuarios/perfil');
  }
}
