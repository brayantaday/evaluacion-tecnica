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
        $departamentoId = Departamento::query()->value('id') ?? 1;
        $cargoId = Cargo::query()->value('id') ?? 1;

        $usuarios = [
            [
                'usuario' => 'jlopez',
                'primerNombre' => 'Juan',
                'segundoNombre' => 'Carlos',
                'primerApellido' => 'Lopez',
                'segundoApellido' => 'Martinez',
                'idDepartamento' => $departamentoId,
                'idCargo' => $cargoId,
            ],
            [
                'usuario' => 'mperez',
                'primerNombre' => 'Maria',
                'segundoNombre' => 'Elena',
                'primerApellido' => 'Perez',
                'segundoApellido' => 'Gomez',
                'idDepartamento' => $departamentoId,
                'idCargo' => $cargoId,
            ],
            [
                'usuario' => 'arodriguez',
                'primerNombre' => 'Andres',
                'segundoNombre' => 'Felipe',
                'primerApellido' => 'Rodriguez',
                'segundoApellido' => 'Suarez',
                'idDepartamento' => $departamentoId,
                'idCargo' => $cargoId,
            ],
        ];

        foreach ($usuarios as $usuario) {
            Usuario::updateOrCreate(
                ['usuario' => $usuario['usuario']],
                $usuario,
            );
        }
    }
}