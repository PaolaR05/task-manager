import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateProyectoDto {
  nombre: string;
  descripcion: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface AsignarColaboradoresDto {
  proyectoId: number;
  usuarioIds: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectFormService {

  private baseUrl = 'http://localhost:5167/api/proyectos';
  private tareasUrl = 'http://localhost:5167/api/tareas';
  private usuariosUrl = 'http://localhost:5167/api/usuarios';

  constructor(private http: HttpClient) {}

  crearProyecto(dto: CreateProyectoDto): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }

  asignarColaboradores(dto: AsignarColaboradoresDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/asignar-colaboradores`, dto);
  }

  obtenerColaboradoresDisponibles(): Observable<any> {
    return this.http.get(`${this.usuariosUrl}/colaboradores`);
  }

  obtenerProyectos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  obtenerTareasPorProyecto(proyectoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.tareasUrl}/por-proyecto/${proyectoId}`);
  }

  actualizarEstadoTarea(tareaId: number, nuevoEstado: number): Observable<any> {
    return this.http.patch(`${this.tareasUrl}/${tareaId}/estado`, { nuevoEstado });
  }

crearTarea(tarea: any): Observable<any> {
  return this.http.post(this.tareasUrl, tarea);
}


  eliminarProyecto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
