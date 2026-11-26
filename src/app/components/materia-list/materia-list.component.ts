import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { MateriaService } from '../../services/materia.service';
import { Materia } from '../../models/materia.model';

@Component({
  selector: 'app-materia-list',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './materia-list.component.html',
  styleUrl: './materia-list.component.css',
})
export class MateriaListComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private materiaService = inject(MateriaService);
  private traductor = inject(TranslateService);

  materias = signal<Materia[]>([]);
  // Guarda la llave de traducción del mensaje (o el detalle que manda el backend)
  mensaje = signal('');
  editandoId = signal<number | null>(null);
  esCoordinador = inject(AuthService).rol() === 'COORDINADOR';

  form = this.fb.group({
    codigoMateria: ['', [Validators.required, Validators.maxLength(10)]],
    nombreMateria: ['', [Validators.required, Validators.maxLength(100)]],
    carrera: ['', [Validators.required, Validators.maxLength(100)]],
    creditos: [4, [Validators.required, Validators.min(1), Validators.max(12)]],
  });

  ngOnInit(): void {
    this.cargarMaterias();
  }

  cargarMaterias(): void {
    this.materiaService.obtenerMaterias().subscribe({
      next: (data) => this.materias.set(data),
      error: (err) => this.mensaje.set(err?.error?.detail ?? 'materias.errorCargar'),
    });
  }

  // Para no repetir la condición en el aria-invalid, el aria-describedby y el mensaje
  campoInvalido(campo: 'codigoMateria' | 'nombreMateria' | 'carrera' | 'creditos'): boolean {
    const control = this.form.controls[campo];
    return control.touched && control.invalid;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensaje.set('materias.revisarCampos');
      return;
    }

    const payload = this.form.getRawValue();
    const id = this.editandoId();
    const peticion =
      id === null
        ? this.materiaService.crearMateria(payload)
        : this.materiaService.actualizarMateria(id, payload);

    peticion.subscribe({
      next: () => {
        this.mensaje.set('');
        this.cancelarEdicion();
        this.cargarMaterias();
      },
      error: (err) => {
        if (err.status === 409) {
          this.mensaje.set('materias.errorDuplicado');
        } else {
          this.mensaje.set(err?.error?.detail ?? 'materias.errorGuardar');
        }
      },
    });
  }

  editar(materia: Materia): void {
    this.editandoId.set(materia.id);
    this.form.setValue({
      codigoMateria: materia.codigoMateria,
      nombreMateria: materia.nombreMateria,
      carrera: materia.carrera,
      creditos: materia.creditos,
    });
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
    this.form.reset();
  }

  eliminar(materia: Materia): void {
    const pregunta = this.traductor.instant('materias.confirmarEliminar', {
      codigo: materia.codigoMateria,
      nombre: materia.nombreMateria,
    });
    if (!confirm(pregunta)) {
      return;
    }
    this.materiaService.eliminarMateria(materia.id).subscribe({
      next: () => this.materias.update((lista) => lista.filter((m) => m.id !== materia.id)),
      error: (err) => this.mensaje.set(err?.error?.detail ?? 'materias.errorEliminar'),
    });
  }
}
