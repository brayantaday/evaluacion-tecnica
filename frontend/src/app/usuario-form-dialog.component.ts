import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Cargo, Departamento, Usuario, UsuarioPayload } from './admin-api.service';

interface UsuarioDialogData {
  cargos: Cargo[];
  departamentos: Departamento[];
  usuario?: Usuario;
}

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  selector: 'app-usuario-form-dialog',
  styleUrl: './usuario-form-dialog.component.scss',
  templateUrl: './usuario-form-dialog.component.html',
})
export class UsuarioFormDialogComponent {
  protected readonly data = inject<UsuarioDialogData>(MAT_DIALOG_DATA);

  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UsuarioFormDialogComponent, UsuarioPayload>);

  protected readonly isEditMode = !!this.data.usuario;
  protected readonly form = this.formBuilder.nonNullable.group({
    usuario: [this.data.usuario?.usuario ?? '', [Validators.required, Validators.maxLength(255)]],
    primerNombre: [this.data.usuario?.primerNombre ?? '', [Validators.required, Validators.maxLength(255)]],
    segundoNombre: [this.data.usuario?.segundoNombre ?? ''],
    primerApellido: [this.data.usuario?.primerApellido ?? '', [Validators.required, Validators.maxLength(255)]],
    segundoApellido: [this.data.usuario?.segundoApellido ?? ''],
    idDepartamento: [this.data.usuario?.idDepartamento ?? 0, [Validators.required, Validators.min(1)]],
    idCargo: [this.data.usuario?.idCargo ?? 0, [Validators.required, Validators.min(1)]],
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();

    this.dialogRef.close({
      ...rawValue,
      segundoApellido: rawValue.segundoApellido || null,
      segundoNombre: rawValue.segundoNombre || null,
    });
  }
}