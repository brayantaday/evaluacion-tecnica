import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Cargo, CatalogoPayload, Departamento } from './admin-api.service';

interface CatalogoDialogData {
  entidad: 'departamento' | 'cargo';
  registro?: Cargo | Departamento;
}

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
  ],
  selector: 'app-catalogo-form-dialog',
  styleUrl: './catalogo-form-dialog.component.scss',
  templateUrl: './catalogo-form-dialog.component.html',
})
export class CatalogoFormDialogComponent {
  protected readonly data = inject<CatalogoDialogData>(MAT_DIALOG_DATA);

  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CatalogoFormDialogComponent, CatalogoPayload>);

  protected readonly isEditMode = !!this.data.registro;
  protected readonly title = this.data.entidad === 'departamento' ? 'Departamento' : 'Cargo';
  protected readonly form = this.formBuilder.nonNullable.group({
    codigo: [this.data.registro?.codigo ?? '', [Validators.required, Validators.maxLength(255)]],
    nombre: [this.data.registro?.nombre ?? '', [Validators.required, Validators.maxLength(255)]],
    activo: [this.data.registro?.activo ?? true],
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      ...this.form.getRawValue(),
      idUsuarioCreacion: this.data.registro?.idUsuarioCreacion ?? 1,
    });
  }
}