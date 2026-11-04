import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  rol: 'ESTUDIANTE' | 'TUTOR' | 'COORDINADOR';
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  login(datos: LoginRequest) {
    return this.http.post<LoginResponse>('/api/auth/login', datos).pipe(
      tap((respuesta) => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('rol', respuesta.rol);
      }),
    );
  }
}