import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MateriaService } from '../../services/materia.service';
import { Materia } from '../../models/materia.model';

@Component({
  selector: 'app-materia-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './materia-list.component.html',
})
export class MateriaListComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private materiaService = inject(MateriaService);

  materias = signal<Materia[]>([]);
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
      error: (err) => this.mensaje.set(err?.error?.detail ?? 'No se pudieron cargar las materias.'),
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensaje.set('Revise los campos marcados antes de guardar.');
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
          this.mensaje.set('Ya existe una materia con ese código.');
        } else {
          this.mensaje.set(err?.error?.detail ?? 'No se pudo guardar la materia.');
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
    if (!confirm(`¿Eliminar ${materia.codigoMateria} - ${materia.nombreMateria}?`)) {
      return;
    }
    this.materiaService.eliminarMateria(materia.id).subscribe({
      next: () => this.materias.update((lista) => lista.filter((m) => m.id !== materia.id)),
      error: (err) => this.mensaje.set(err?.error?.detail ?? 'No se pudo eliminar la materia.'),
    });
  }
}
