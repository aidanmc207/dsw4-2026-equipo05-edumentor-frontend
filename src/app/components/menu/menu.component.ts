import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
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
