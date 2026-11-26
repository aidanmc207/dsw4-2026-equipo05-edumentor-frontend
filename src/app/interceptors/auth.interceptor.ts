import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.obtenerToken();

  if (!token) {
    return next(req);
  }

  const peticion = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el backend rechaza el token es porque venció o no es válido
      if (error.status === 401) {
        authService.cerrarSesion();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
