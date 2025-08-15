import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definición de la interfaz para el DTO
export interface ProyectoConAvanceDto {
  id: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  porcentajeAvance: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  obtenerTotalColaboradores(): Observable<number> {
    return this.http.get<number>('/api/usuarios/total-colaboradores'); 
  }

  obtenerTotalEmpresas(): Observable<number> {
    return this.http.get<number>('/api/empresas/total'); 
  }

  obtenerTotalClientes(): Observable<number> {
    return this.http.get<number>('/api/clientes/total'); 
  }

  obtenerTotalProyectos(): Observable<number> {
    return this.http.get<number>('/api/proyectos/total'); 
  }

  obtenerPerfil(): Observable<any> {
    return this.http.get<any>('/api/usuarios/perfil');
  }

obtenerProyectosConAvance(): Observable<ProyectoConAvanceDto[]> {
  return this.http.get<ProyectoConAvanceDto[]>(`/api/proyectos/con-avance`);
}

}
