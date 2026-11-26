import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { SelectorIdiomaComponent } from '../selector-idioma/selector-idioma.component';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe, SelectorIdiomaComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  rol = this.authService.rol;
  nombre = this.authService.nombre;

  salir(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
