import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Rol } from '../models/auth.model';
import { AuthService } from '../services/auth.service';

// Los roles permitidos se ponen en la ruta: data: { roles: ['TUTOR'] }
export const rolGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const rolesPermitidos = route.data['roles'] as Rol[];
  const rol = authService.rol();

  if (rol && rolesPermitidos.includes(rol)) {
    return true;
  }
  return router.createUrlTree(['/inicio']);
};
