import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Idioma = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class IdiomaService {
  private readonly traductor = inject(TranslateService);

  readonly actual = signal<Idioma>(this.leerGuardado());

  constructor() {
    this.aplicar(this.actual());
  }

  cambiar(idioma: Idioma) {
    this.actual.set(idioma);
    localStorage.setItem('idioma', idioma);
    this.aplicar(idioma);
  }

  private aplicar(idioma: Idioma) {
    this.traductor.use(idioma);
    document.documentElement.lang = idioma;
  }

  private leerGuardado(): Idioma {
    return localStorage.getItem('idioma') === 'en' ? 'en' : 'es';
  }
}
