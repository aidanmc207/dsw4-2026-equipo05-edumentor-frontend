import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { MateriaListComponent } from './components/materia-list/materia-list.component';
import { sesionGuard } from './guards/sesion.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent, canActivate: [sesionGuard] },
  { path: 'materias', component: MateriaListComponent, canActivate: [sesionGuard] },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' },
];
