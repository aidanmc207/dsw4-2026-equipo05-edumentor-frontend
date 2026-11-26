export type Rol = 'ESTUDIANTE' | 'TUTOR' | 'COORDINADOR';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginRespuesta {
  token: string;
  rol: Rol;
  nombre: string;
}
