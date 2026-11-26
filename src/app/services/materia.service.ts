import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Materia, MateriaPayload } from '../models/materia.model';

@Injectable({
  providedIn: 'root',
})
export class MateriaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/materias';

  obtenerMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.baseUrl);
  }

  crearMateria(payload: MateriaPayload): Observable<Materia> {
    return this.http.post<Materia>(this.baseUrl, payload);
  }

  actualizarMateria(id: number, payload: MateriaPayload): Observable<Materia> {
    return this.http.put<Materia>(`${this.baseUrl}/${id}`, payload);
  }

  eliminarMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
