import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginPayload, LoginRespuesta } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/auth';

  login(payload: LoginPayload): Observable<LoginRespuesta> {
    return this.http.post<LoginRespuesta>(`${this.baseUrl}/login`, payload).pipe(
      tap((respuesta) => {
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('rol', respuesta.rol);
      }),
    );
  }
}
