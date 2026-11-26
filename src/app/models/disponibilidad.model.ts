export type DiaSemana = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface Disponibilidad {
  id: number;
  tutorId: number;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  estaActivo: boolean;
}

export interface DisponibilidadPayload {
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  estaActivo?: boolean;
}
