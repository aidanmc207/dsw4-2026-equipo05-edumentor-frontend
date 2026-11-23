import { Routes } from '@angular/router';
import { Login } from './paginas/login/login';
import { MatrizHorariosComponent } from './components/matriz-horarios/matriz-horarios.component';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'disponibilidad', component: MatrizHorariosComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];