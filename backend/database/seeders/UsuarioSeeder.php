<?php

namespace Database\Seeders;

use App\Models\Cargo;
use App\Models\Departamento;
use App\Models\Usuario;
use Illuminate\Database\Seeder;

class UsuarioSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Usuario::updateOrCreate([
            'usuario' => 'jlopez',
        ], [
            'primerNombre' => 'Juan',
            'segundoNombre' => 'Carlos',
            'primerApellido' => 'Lopez',
            'segundoApellido' => 'Martinez',
            'idDepartamento' => Departamento::query()->value('id') ?? 1,
            'idCargo' => Cargo::query()->value('id') ?? 1,
        ]);
    }
}