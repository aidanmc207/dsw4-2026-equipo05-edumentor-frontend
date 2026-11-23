import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disponibilidad, DisponibilidadPayload } from '../models/disponibilidad.model';

@Injectable({
  providedIn: 'root',
})
export class DisponibilidadService {
  private http = inject(HttpClient);

  obtenerMiUsuarioId(): Observable<{ id: number }> {
    return this.http.get<{ id: number }>('/api/usuarios/yo');
  }

  obtenerDisponibilidad(tutorId: number): Observable<Disponibilidad[]> {
    return this.http.get<Disponibilidad[]>(`/api/tutores/${tutorId}/disponibilidad`);
  }

  crearBloque(tutorId: number, payload: DisponibilidadPayload): Observable<Disponibilidad> {
    return this.http.post<Disponibilidad>(`/api/tutores/${tutorId}/disponibilidad`, payload);
  }

  actualizarBloque(id: number, payload: DisponibilidadPayload): Observable<Disponibilidad> {
    return this.http.put<Disponibilidad>(`/api/disponibilidad/${id}`, payload);
  }

  eliminarBloque(id: number): Observable<void> {
    return this.http.delete<void>(`/api/disponibilidad/${id}`);
  }
}
