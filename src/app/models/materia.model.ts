export interface Materia {
  id: number;
  codigoMateria: string;
  nombreMateria: string;
  carrera: string;
  creditos: number;
}

export interface MateriaPayload {
  codigoMateria: string;
  nombreMateria: string;
  carrera: string;
  creditos: number;
}
