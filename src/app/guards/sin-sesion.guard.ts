import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Si ya inició sesión no tiene sentido mostrarle el login otra vez
export const sinSesionGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.haySesion()) {
    return router.createUrlTree(['/inicio']);
  }
  return true;
};
