import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  template: `
    <main class="contenido">
      <h1>Hola, {{ nombre() }}</h1>
      <p>Use el menú de arriba para ir a las materias y sus opciones.</p>
    </main>
  `,
  styles: `
    .contenido {
      max-width: 60rem;
      margin: 0 auto;
      padding: 1.5rem;
    }
  `,
})
export class InicioComponent {
  nombre = inject(AuthService).nombre;
}
