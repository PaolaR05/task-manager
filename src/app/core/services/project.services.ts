import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface Tarea {
  id: number;
  descripcion: string;
  fechaInicioEstimado: string;
  fechaFinEstimado?: string;
  estado: number;
  proyectoId: number;
}

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

  // --- Métodos de Proyectos ---
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

  eliminarProyecto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // --- Métodos de Tareas ---
  obtenerTareasPorProyecto(proyectoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.tareasUrl}/por-proyecto/${proyectoId}`);
  }

  crearTarea(tarea: any): Observable<any> {
    return this.http.post(this.tareasUrl, tarea, { headers: this.getAuthHeaders() });
  }

  actualizarEstadoTarea(tareaId: number, nuevoEstado: number): Observable<any> {
    return this.http.patch(`${this.tareasUrl}/${tareaId}/estado`, { nuevoEstado }, { headers: this.getAuthHeaders() });
  }

  eliminarTarea(tareaId: number): Observable<any> {
    return this.http.delete(`${this.tareasUrl}/${tareaId}`, { headers: this.getAuthHeaders() });
  }

 agregarComentario(tareaId: number, comentarioTexto: string): Observable<any> {
  const token = localStorage.getItem('token');
  const comentario = { comentarioTexto };
  
  return this.http.post(`${this.tareasUrl}/${tareaId}/comentarios`, comentario, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}
  obtenerDetalleTarea(tareaId: number): Observable<any> {
    return this.http.get<any>(`${this.tareasUrl}/${tareaId}`, { headers: this.getAuthHeaders() });
  }

  actualizarTarea(tareaId: number, datosActualizados: any): Observable<any> {
    return this.http.put(`${this.tareasUrl}/${tareaId}`, datosActualizados, { headers: this.getAuthHeaders() });
  }

  // --- Método privado para agregar token ---
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getTareaConComentarios(tareaId: number) {
  const token = localStorage.getItem('token');
  return this.http.get<any>(`${this.tareasUrl}/${tareaId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}

subirAdjunto(tareaId: number, formData: FormData): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.post(`${this.tareasUrl}/${tareaId}/adjuntos`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

}
