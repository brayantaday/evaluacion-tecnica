<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'usuario',
    'primerNombre',
    'segundoNombre',
    'primerApellido',
    'segundoApellido',
    'idDepartamento',
    'idCargo',
])]
class Usuario extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function departamento(): BelongsTo
    {
        return $this->belongsTo(Departamento::class, 'idDepartamento');
    }

    public function cargo(): BelongsTo
    {
        return $this->belongsTo(Cargo::class, 'idCargo');
    }
}