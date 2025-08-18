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

export interface ProyectoConAvance {
  Id: number;
  Nombre: string;
  Descripcion?: string;
  FechaInicio?: string;
  FechaFin?: string;
  PorcentajeAvance: number;
}

export interface AsignarColaboradoresDto {
  proyectoId: number;
  usuarioIds: number[];
}

export interface TareaDetalle {
  Id: number;
  Descripcion: string;
  
}
export interface ProyectoConTareas {
  Id: number;
  Nombre: string;
  Descripcion?: string;
  FechaInicio?: string;
  FechaFin?: string;
  Tareas: TareaDetalle[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectFormService {

  private baseUrl = 'http://localhost:5167/api/proyectos';
  private tareasUrl = 'http://localhost:5167/api/tareas';
  private usuariosUrl = 'http://localhost:5167/api/usuarios';

  constructor(private http: HttpClient) {}

  // --- Proyectos ---
  crearProyecto(dto: CreateProyectoDto): Observable<any> {
    return this.http.post(this.baseUrl, dto, { headers: this.getAuthHeaders() });
  }

asignarColaboradores(dto: AsignarColaboradoresDto): Observable<any> {
  return this.http.post(`${this.baseUrl}/asignar-colaboradores`, dto, {
    headers: this.getAuthHeaders(),
    responseType: 'text' as const  // 👈 Aquí le dices que es texto plano
  });
}


  obtenerColaboradoresDisponibles(): Observable<any> {
    return this.http.get(`${this.usuariosUrl}/colaboradores`, { headers: this.getAuthHeaders() });
  }

  obtenerProyectos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  eliminarProyecto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // --- Tareas ---
  obtenerTareasPorProyecto(proyectoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.tareasUrl}/por-proyecto/${proyectoId}`, { headers: this.getAuthHeaders() });
  }

  crearTarea(tarea: any): Observable<any> {
    return this.http.post(this.tareasUrl, tarea, { headers: this.getAuthHeaders() });
  }

  actualizarEstadoTarea(tareaId: number, nuevoEstado: number): Observable<any> {
    return this.http.patch(`${this.tareasUrl}/${tareaId}/estado`, nuevoEstado, { headers: this.getAuthHeaders() });
  }

  eliminarTarea(tareaId: number): Observable<any> {
    return this.http.delete(`${this.tareasUrl}/${tareaId}`, { headers: this.getAuthHeaders() });
  }

  agregarComentario(tareaId: number, comentarioTexto: string): Observable<any> {
    return this.http.post(`${this.tareasUrl}/${tareaId}/comentarios`, { comentarioTexto }, { headers: this.getAuthHeaders() });
  }

  obtenerDetalleTarea(tareaId: number): Observable<any> {
    return this.http.get<any>(`${this.tareasUrl}/${tareaId}`, { headers: this.getAuthHeaders() });
  }

  actualizarTarea(tareaId: number, datosActualizados: any): Observable<any> {
    return this.http.put(`${this.tareasUrl}/${tareaId}`, datosActualizados, { headers: this.getAuthHeaders() });
  }

  subirAdjunto(tareaId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.tareasUrl}/${tareaId}/adjuntos`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      })
    });
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    });
  }
getProyectosConAvance(): Observable<ProyectoConAvance[]> {
  return this.http.get<ProyectoConAvance[]>(`${this.baseUrl}/con-avance`, {
    headers: this.getAuthHeaders()
  });
}

obtenerProyectosAsignados(): Observable<ProyectoConTareas[]> {
  const url = `${this.baseUrl}/asignados`;
  console.log('🌐 Llamando a:', url);

  return this.http.get<ProyectoConTareas[]>(url, {
    headers: this.getAuthHeaders()
  });
}
}