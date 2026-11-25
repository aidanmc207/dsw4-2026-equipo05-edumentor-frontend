import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginPayload, LoginRespuesta, Rol } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/auth';

  // Signals para que el menú se actualice al entrar o salir sin recargar la página
  readonly rol = signal<Rol | null>(localStorage.getItem('rol') as Rol | null);
  readonly nombre = signal(localStorage.getItem('nombre') ?? '');

  login(payload: LoginPayload): Observable<LoginRespuesta> {
    return this.http.post<LoginRespuesta>(`${this.baseUrl}/login`, payload).pipe(
      tap((respuesta) => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('rol', respuesta.rol);
        localStorage.setItem('nombre', respuesta.nombre);
        this.rol.set(respuesta.rol);
        this.nombre.set(respuesta.nombre);
      }),
    );
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  haySesion(): boolean {
    return this.obtenerToken() !== null;
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    this.rol.set(null);
    this.nombre.set('');
  }
}
