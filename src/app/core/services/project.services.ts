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

  private baseUrl = '/api/proyectos';

  constructor(private http: HttpClient) {}

  crearProyecto(dto: CreateProyectoDto): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }

  asignarColaboradores(dto: AsignarColaboradoresDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/asignar-colaboradores`, dto);
  }

  obtenerColaboradoresDisponibles(): Observable<any> {
    // Llama a tu endpoint para obtener usuarios colaboradores (filtrados por empresa)
    return this.http.get('/api/usuarios/colaboradores');
  }

  obtenerProyectos(): Observable<any[]> {
  return this.http.get<any[]>(this.baseUrl);
}

obtenerTareasPorProyecto(proyectoId: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/tareas/por-proyecto/${proyectoId}`);
}

actualizarEstadoTarea(tareaId: number, nuevoEstado: number): Observable<any> {
  return this.http.put(`/api/tareas/${tareaId}/estado`, { estado: nuevoEstado });
}

crearTarea(tarea: any): Observable<any> {
  return this.http.post('/api/tareas', tarea);
}

}
