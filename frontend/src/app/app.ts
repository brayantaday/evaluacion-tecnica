import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { finalize, forkJoin, Observable } from 'rxjs';
import { AdminApiService, Cargo, CatalogoPayload, Departamento, Usuario, UsuarioPayload } from './admin-api.service';
import { CatalogoFormDialogComponent } from './catalogo-form-dialog.component';
import { UsuarioFormDialogComponent } from './usuario-form-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly api = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly title = 'Administracion de usuarios';
  protected readonly displayedColumns = ['usuario', 'nombres', 'apellidos', 'departamento', 'cargo', 'acciones'];
  protected readonly catalogColumns = ['codigo', 'nombre', 'activo', 'acciones'];
  protected readonly departamentos = signal<Departamento[]>([]);
  protected readonly cargos = signal<Cargo[]>([]);
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly selectedDepartamentoId = signal<number | null>(null);
  protected readonly selectedCargoId = signal<number | null>(null);
  protected readonly filteredUsuarios = computed(() => this.usuarios().filter((usuario) => {
    const matchesDepartamento = this.selectedDepartamentoId() === null
      || usuario.idDepartamento === this.selectedDepartamentoId();
    const matchesCargo = this.selectedCargoId() === null
      || usuario.idCargo === this.selectedCargoId();

    return matchesDepartamento && matchesCargo;
  }));
  protected readonly activeFiltersCount = computed(() => [
    this.selectedDepartamentoId(),
    this.selectedCargoId(),
  ].filter((value) => value !== null).length);

  constructor() {
    this.loadData();
  }

  protected onDepartamentoChange(event: MatSelectChange): void {
    this.selectedDepartamentoId.set(event.value ?? null);
  }

  protected onCargoChange(event: MatSelectChange): void {
    this.selectedCargoId.set(event.value ?? null);
  }

  protected clearFilters(): void {
    this.selectedDepartamentoId.set(null);
    this.selectedCargoId.set(null);
  }

  protected openCreateDialog(): void {
    this.openUsuarioDialog();
  }

  protected openCreateDepartamentoDialog(): void {
    this.openCatalogoDialog('departamento');
  }

  protected openCreateCargoDialog(): void {
    this.openCatalogoDialog('cargo');
  }

  protected openEditDialog(usuario: Usuario): void {
    this.openUsuarioDialog(usuario);
  }

  protected openEditDepartamentoDialog(departamento: Departamento): void {
    this.openCatalogoDialog('departamento', departamento);
  }

  protected openEditCargoDialog(cargo: Cargo): void {
    this.openCatalogoDialog('cargo', cargo);
  }

  protected deleteUsuario(usuario: Usuario): void {
    if (!window.confirm(`Eliminar al usuario ${usuario.usuario}?`)) {
      return;
    }

    this.runRequestWithFeedback(
      this.api.deleteUsuario(usuario.id),
      'Eliminando usuario...',
      'Usuario eliminado correctamente.',
      'No fue posible eliminar el usuario.',
      () => this.loadUsuarios(),
      () => this.loadUsuarios(),
    );
  }

  protected deleteDepartamento(departamento: Departamento): void {
    if (!window.confirm(`Eliminar el departamento ${departamento.nombre}?`)) {
      return;
    }

    this.runRequestWithFeedback(
      this.api.deleteDepartamento(departamento.id),
      'Eliminando departamento...',
      'Departamento eliminado correctamente.',
      'No fue posible eliminar el departamento.',
      () => this.loadData(),
    );
  }

  protected deleteCargo(cargo: Cargo): void {
    if (!window.confirm(`Eliminar el cargo ${cargo.nombre}?`)) {
      return;
    }

    this.runRequestWithFeedback(
      this.api.deleteCargo(cargo.id),
      'Eliminando cargo...',
      'Cargo eliminado correctamente.',
      'No fue posible eliminar el cargo.',
      () => this.loadData(),
    );
  }

  protected statusLabel(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }

  protected fullName(usuario: Usuario): string {
    return [usuario.primerNombre, usuario.segundoNombre].filter(Boolean).join(' ');
  }

  protected fullLastName(usuario: Usuario): string {
    return [usuario.primerApellido, usuario.segundoApellido].filter(Boolean).join(' ');
  }

  private openUsuarioDialog(usuario?: Usuario): void {
    const dialogRef = this.dialog.open(UsuarioFormDialogComponent, {
      autoFocus: false,
      data: {
        cargos: this.cargos(),
        departamentos: this.departamentos(),
        usuario,
      },
      maxWidth: '96vw',
      panelClass: 'usuario-dialog-panel',
      width: '760px',
    });

    dialogRef.afterClosed().subscribe((payload: UsuarioPayload | undefined) => {
      if (!payload) {
        return;
      }

      const request$ = usuario
        ? this.api.updateUsuario(usuario.id, payload)
        : this.api.createUsuario(payload);

      this.runRequestWithFeedback(
        request$,
        usuario ? 'Guardando cambios del usuario...' : 'Creando usuario...',
        usuario ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.',
        'No fue posible guardar el usuario.',
        () => this.loadUsuarios(),
      );
    });
  }

  private openCatalogoDialog(tipo: 'departamento' | 'cargo', registro?: Departamento | Cargo): void {
    const dialogRef = this.dialog.open(CatalogoFormDialogComponent, {
      autoFocus: false,
      data: {
        entidad: tipo,
        registro,
      },
      maxWidth: '96vw',
      panelClass: 'usuario-dialog-panel',
      width: '520px',
    });

    dialogRef.afterClosed().subscribe((payload: CatalogoPayload | undefined) => {
      if (!payload) {
        return;
      }

      const request$ = tipo === 'departamento'
        ? registro
          ? this.api.updateDepartamento(registro.id, payload)
          : this.api.createDepartamento(payload)
        : registro
          ? this.api.updateCargo(registro.id, payload)
          : this.api.createCargo(payload);

      const entidad = tipo === 'departamento' ? 'departamento' : 'cargo';

      this.runRequestWithFeedback(
        request$,
        registro ? `Guardando cambios del ${entidad}...` : `Creando ${entidad}...`,
        `${tipo === 'departamento' ? 'Departamento' : 'Cargo'} ${registro ? 'actualizado' : 'creado'} correctamente.`,
        `No fue posible guardar el ${entidad}.`,
        () => this.loadData(),
      );
    });
  }

  private runRequestWithFeedback<T>(
    request$: Observable<T>,
    pendingMessage: string,
    successMessage: string,
    errorMessage: string,
    onSuccess: () => void,
    onNotFound?: () => void,
  ): void {
    const pendingSnackBarRef = this.snackBar.open(pendingMessage);

    request$.pipe(
      finalize(() => pendingSnackBarRef.dismiss()),
    ).subscribe({
      next: () => {
        this.snackBar.open(successMessage, 'Cerrar', { duration: 3000 });
        onSuccess();
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404 && onNotFound) {
          this.snackBar.open('El registro ya no existe. La lista fue actualizada.', 'Cerrar', { duration: 3500 });
          onNotFound();
          return;
        }

        const backendMessage = error instanceof HttpErrorResponse
          ? this.extractErrorMessage(error)
          : null;

        this.snackBar.open(backendMessage ?? errorMessage, 'Cerrar', { duration: 3500 });
      },
    });
  }

  private extractErrorMessage(error: HttpErrorResponse): string | null {
    if (typeof error.error?.message === 'string' && error.error.message.trim().length > 0) {
      return error.error.message;
    }

    return null;
  }

  private loadData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      cargos: this.api.getCargos(),
      departamentos: this.api.getDepartamentos(),
      usuarios: this.api.getUsuarios(),
    }).subscribe({
      next: ({ cargos, departamentos, usuarios }) => {
        this.cargos.set(cargos);
        this.departamentos.set(departamentos);
        this.usuarios.set(usuarios);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No fue posible cargar la informacion del modulo. Verifica que la API de Laravel este disponible en http://localhost:8000.');
        this.isLoading.set(false);
      },
    });
  }

  private loadUsuarios(): void {
    this.api.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
      },
      error: () => {
        this.snackBar.open('No fue posible actualizar la lista de usuarios.', 'Cerrar', { duration: 3500 });
      },
    });
  }
}
