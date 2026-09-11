<?php

namespace Database\Seeders;

use App\Models\Cargo;
use App\Models\User;
use Illuminate\Database\Seeder;

class CargoSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $userId = User::query()->value('id') ?? 1;

        $cargos = [
            [
                'codigo' => 'CAR-001',
                'nombre' => 'Analista',
                'activo' => true,
                'idUsuarioCreacion' => $userId,
            ],
            [
                'codigo' => 'CAR-002',
                'nombre' => 'Coordinador',
                'activo' => true,
                'idUsuarioCreacion' => $userId,
            ],
            [
                'codigo' => 'CAR-003',
                'nombre' => 'Jefe de Area',
                'activo' => true,
                'idUsuarioCreacion' => $userId,
            ],
        ];

        foreach ($cargos as $cargo) {
            Cargo::updateOrCreate(
                ['codigo' => $cargo['codigo']],
                $cargo,
            );
        }
    }
}