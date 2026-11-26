import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { MateriaListComponent } from './components/materia-list/materia-list.component';
import { MatrizHorariosComponent } from './components/matriz-horarios/matriz-horarios.component';
import { sesionGuard } from './guards/sesion.guard';
import { sinSesionGuard } from './guards/sin-sesion.guard';
import { rolGuard } from './guards/rol.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [sinSesionGuard] },
  { path: 'inicio', component: InicioComponent, canActivate: [sesionGuard] },
  { path: 'materias', component: MateriaListComponent, canActivate: [sesionGuard] },
  {
    path: 'disponibilidad',
    component: MatrizHorariosComponent,
    canActivate: [sesionGuard, rolGuard],
    data: { roles: ['TUTOR'] },
  },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' },
];
