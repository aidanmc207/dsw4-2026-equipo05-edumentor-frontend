import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Idioma, IdiomaService } from '../../services/idioma.service';

@Component({
  selector: 'app-selector-idioma',
  imports: [TranslatePipe],
  templateUrl: './selector-idioma.component.html',
  styleUrl: './selector-idioma.component.css',
})
export class SelectorIdiomaComponent {
  protected readonly idioma = inject(IdiomaService);

  protected cambiar(evento: Event) {
    const codigo = (evento.target as HTMLSelectElement).value as Idioma;
    this.idioma.cambiar(codigo);
  }
}
