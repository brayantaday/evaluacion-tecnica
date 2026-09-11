<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}