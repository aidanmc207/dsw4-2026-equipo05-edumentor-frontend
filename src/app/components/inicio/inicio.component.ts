import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  imports: [TranslatePipe],
  template: `
    <main class="contenido">
      <h1>{{ 'inicio.saludo' | translate: { nombre: nombre() } }}</h1>
      <p>{{ 'inicio.ayuda' | translate }}</p>
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
