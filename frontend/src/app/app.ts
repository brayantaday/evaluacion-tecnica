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
import { forkJoin } from 'rxjs';
import { AdminApiService, Cargo, Departamento, Usuario, UsuarioPayload } from './admin-api.service';
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

  protected openEditDialog(usuario: Usuario): void {
    this.openUsuarioDialog(usuario);
  }

  protected deleteUsuario(usuario: Usuario): void {
    if (!window.confirm(`Eliminar al usuario ${usuario.usuario}?`)) {
      return;
    }

    this.api.deleteUsuario(usuario.id).subscribe({
      next: () => {
        this.snackBar.open('Usuario eliminado correctamente.', 'Cerrar', { duration: 3000 });
        this.loadUsuarios();
      },
      error: () => {
        this.snackBar.open('No fue posible eliminar el usuario.', 'Cerrar', { duration: 3500 });
      },
    });
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

      request$.subscribe({
        next: () => {
          this.snackBar.open(
            usuario ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.',
            'Cerrar',
            { duration: 3000 },
          );
          this.loadUsuarios();
        },
        error: () => {
          this.snackBar.open('No fue posible guardar el usuario.', 'Cerrar', { duration: 3500 });
        },
      });
    });
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
