import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { SelectorIdiomaComponent } from './components/selector-idioma/selector-idioma.component';
import { AuthService } from './services/auth.service';

@Component({
  imports: [RouterOutlet, MenuComponent, SelectorIdiomaComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  rol = inject(AuthService).rol;
}
