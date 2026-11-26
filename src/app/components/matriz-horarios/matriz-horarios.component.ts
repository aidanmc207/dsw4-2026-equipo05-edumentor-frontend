import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DisponibilidadService } from '../../services/disponibilidad.service';
import { DiaSemana, Disponibilidad } from '../../models/disponibilidad.model';

// Las horas vienen como texto "HH:mm", así que se pueden comparar directamente
const horasValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const inicio = group.get('horaInicio')?.value;
  const fin = group.get('horaFin')?.value;
  if (!inicio || !fin) {
    return null;
  }
  return fin > inicio ? null : { horasInvalidas: true };
};

@Component({
  selector: 'app-matriz-horarios',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './matriz-horarios.component.html',
  styleUrl: './matriz-horarios.component.css',
})
export class MatrizHorariosComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private disponibilidadService = inject(DisponibilidadService);
  private traductor = inject(TranslateService);

  // El nombre de cada día sale de las traducciones (dias.MONDAY, dias.TUESDAY, ...)
  dias: DiaSemana[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  horas = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  tutorId = signal<number | null>(null);
  bloques = signal<Disponibilidad[]>([]);
  // Guarda la llave de traducción del mensaje (o el detalle que manda el backend)
  mensaje = signal('');

  form = this.fb.group(
    {
      diaSemana: this.fb.control<DiaSemana>('MONDAY', Validators.required),
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
    },
    { validators: horasValidator },
  );

  ngOnInit(): void {
    this.disponibilidadService.obtenerMiUsuarioId().subscribe({
      next: (usuario) => {
        this.tutorId.set(usuario.id);
        this.cargarBloques();
      },
      error: () => this.mensaje.set('disponibilidad.errorUsuario'),
    });
  }

  cargarBloques(): void {
    const id = this.tutorId();
    if (id === null) {
      return;
    }
    this.disponibilidadService.obtenerDisponibilidad(id).subscribe({
      next: (data) => this.bloques.set(data),
      error: (err) => this.mensaje.set(err?.error?.detail ?? 'disponibilidad.errorCargar'),
    });
  }

  formatoHora(hora: number): string {
    return hora.toString().padStart(2, '0') + ':00';
  }

  // Una celda se marca si algún bloque activo ocupa parte de esa hora
  estaDisponible(dia: DiaSemana, hora: number): boolean {
    const inicioCelda = this.formatoHora(hora);
    const finCelda = this.formatoHora(hora + 1);
    // El backend manda "HH:mm:ss"; se recorta a "HH:mm" para comparar igual que las celdas
    return this.bloques().some(
      (b) =>
        b.estaActivo &&
        b.diaSemana === dia &&
        b.horaInicio.substring(0, 5) < finCelda &&
        b.horaFin.substring(0, 5) > inicioCelda,
    );
  }

  agregar(): void {
    const id = this.tutorId();
    if (this.form.invalid || id === null) {
      this.form.markAllAsTouched();
      this.mensaje.set('disponibilidad.revisarCampos');
      return;
    }

    this.disponibilidadService.crearBloque(id, this.form.getRawValue()).subscribe({
      next: () => {
        this.mensaje.set('');
        this.form.reset();
        this.cargarBloques();
      },
      error: (err) => {
        if (err.status === 409) {
          this.mensaje.set('disponibilidad.errorChoque');
        } else {
          this.mensaje.set(err?.error?.detail ?? 'disponibilidad.errorAgregar');
        }
      },
    });
  }

  cambiarEstado(bloque: Disponibilidad): void {
    const payload = {
      diaSemana: bloque.diaSemana,
      horaInicio: bloque.horaInicio,
      horaFin: bloque.horaFin,
      estaActivo: !bloque.estaActivo,
    };
    this.disponibilidadService.actualizarBloque(bloque.id, payload).subscribe({
      next: (actualizado) =>
        this.bloques.update((lista) => lista.map((b) => (b.id === actualizado.id ? actualizado : b))),
      error: (err) => {
        if (err.status === 409) {
          this.mensaje.set('disponibilidad.errorActivar');
        } else {
          this.mensaje.set(err?.error?.detail ?? 'disponibilidad.errorEstado');
        }
      },
    });
  }

  eliminar(bloque: Disponibilidad): void {
    const pregunta = this.traductor.instant('disponibilidad.confirmarEliminar', {
      dia: this.traductor.instant('dias.' + bloque.diaSemana),
      inicio: bloque.horaInicio.substring(0, 5),
      fin: bloque.horaFin.substring(0, 5),
    });
    if (!confirm(pregunta)) {
      return;
    }
    this.disponibilidadService.eliminarBloque(bloque.id).subscribe({
      next: () => this.bloques.update((lista) => lista.filter((b) => b.id !== bloque.id)),
      error: (err) => this.mensaje.set(err?.error?.detail ?? 'disponibilidad.errorEliminar'),
    });
  }
}
