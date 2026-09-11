import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Departamento {
  id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
  idUsuarioCreacion: number;
}

export interface Cargo {
  id: number;
  codigo: string;
  nombre: string;
  activo: boolean;
  idUsuarioCreacion: number;
}

export interface Usuario {
  id: number;
  usuario: string;
  primerNombre: string;
  segundoNombre: string | null;
  primerApellido: string;
  segundoApellido: string | null;
  idDepartamento: number;
  idCargo: number;
  departamento?: Departamento;
  cargo?: Cargo;
}

export interface UsuarioPayload {
  usuario: string;
  primerNombre: string;
  segundoNombre: string | null;
  primerApellido: string;
  segundoApellido: string | null;
  idDepartamento: number;
  idCargo: number;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8000/api';

  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.apiUrl}/departamentos`);
  }

  getCargos(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(`${this.apiUrl}/cargos`);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  createUsuario(payload: UsuarioPayload): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, payload);
  }

  updateUsuario(id: number, payload: UsuarioPayload): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, payload);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }
}