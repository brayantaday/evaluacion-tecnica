import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

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

export interface CatalogoPayload {
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

type ApiNumber = number | string;

interface ApiDepartamento extends Omit<Departamento, 'id' | 'idUsuarioCreacion'> {
  id: ApiNumber;
  idUsuarioCreacion: ApiNumber;
}

interface ApiCargo extends Omit<Cargo, 'id' | 'idUsuarioCreacion'> {
  id: ApiNumber;
  idUsuarioCreacion: ApiNumber;
}

interface ApiUsuario extends Omit<Usuario, 'id' | 'idDepartamento' | 'idCargo' | 'departamento' | 'cargo'> {
  id: ApiNumber;
  idDepartamento: ApiNumber;
  idCargo: ApiNumber;
  departamento?: ApiDepartamento;
  cargo?: ApiCargo;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8000/api';

  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<ApiDepartamento[]>(`${this.apiUrl}/departamentos`).pipe(
      map((departamentos) => departamentos.map((departamento) => this.normalizeDepartamento(departamento))),
    );
  }

  getCargos(): Observable<Cargo[]> {
    return this.http.get<ApiCargo[]>(`${this.apiUrl}/cargos`).pipe(
      map((cargos) => cargos.map((cargo) => this.normalizeCargo(cargo))),
    );
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<ApiUsuario[]>(`${this.apiUrl}/usuarios`).pipe(
      map((usuarios) => usuarios.map((usuario) => this.normalizeUsuario(usuario))),
    );
  }

  createUsuario(payload: UsuarioPayload): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, payload);
  }

  createDepartamento(payload: CatalogoPayload): Observable<Departamento> {
    return this.http.post<ApiDepartamento>(`${this.apiUrl}/departamentos`, payload).pipe(
      map((departamento) => this.normalizeDepartamento(departamento)),
    );
  }

  createCargo(payload: CatalogoPayload): Observable<Cargo> {
    return this.http.post<ApiCargo>(`${this.apiUrl}/cargos`, payload).pipe(
      map((cargo) => this.normalizeCargo(cargo)),
    );
  }

  updateUsuario(id: number, payload: UsuarioPayload): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, payload);
  }

  updateDepartamento(id: number, payload: CatalogoPayload): Observable<Departamento> {
    return this.http.put<ApiDepartamento>(`${this.apiUrl}/departamentos/${id}`, payload).pipe(
      map((departamento) => this.normalizeDepartamento(departamento)),
    );
  }

  updateCargo(id: number, payload: CatalogoPayload): Observable<Cargo> {
    return this.http.put<ApiCargo>(`${this.apiUrl}/cargos/${id}`, payload).pipe(
      map((cargo) => this.normalizeCargo(cargo)),
    );
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }

  deleteDepartamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/departamentos/${id}`);
  }

  deleteCargo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cargos/${id}`);
  }

  private normalizeDepartamento(departamento: ApiDepartamento): Departamento {
    return {
      ...departamento,
      id: Number(departamento.id),
      idUsuarioCreacion: Number(departamento.idUsuarioCreacion),
    };
  }

  private normalizeCargo(cargo: ApiCargo): Cargo {
    return {
      ...cargo,
      id: Number(cargo.id),
      idUsuarioCreacion: Number(cargo.idUsuarioCreacion),
    };
  }

  private normalizeUsuario(usuario: ApiUsuario): Usuario {
    return {
      ...usuario,
      id: Number(usuario.id),
      idDepartamento: Number(usuario.idDepartamento),
      idCargo: Number(usuario.idCargo),
      departamento: usuario.departamento ? this.normalizeDepartamento(usuario.departamento) : undefined,
      cargo: usuario.cargo ? this.normalizeCargo(usuario.cargo) : undefined,
    };
  }
}