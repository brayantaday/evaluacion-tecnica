<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['codigo', 'nombre', 'activo', 'idUsuarioCreacion'])]
class Departamento extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function usuarios(): HasMany
    {
        return $this->hasMany(Usuario::class, 'idDepartamento');
    }

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }
}