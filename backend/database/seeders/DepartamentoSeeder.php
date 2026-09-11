<?php

namespace Database\Seeders;

use App\Models\Departamento;
use App\Models\User;
use Illuminate\Database\Seeder;

class DepartamentoSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $userId = User::query()->value('id') ?? 1;

        $departamentos = [
            [
                'codigo' => 'DEP-001',
                'nombre' => 'Recursos Humanos',
                'activo' => true,
                'idUsuarioCreacion' => $userId,
            ],
            [
                'codigo' => 'DEP-002',
                'nombre' => 'Tecnologia',
                'activo' => true,
                'idUsuarioCreacion' => $userId,
            ],
            [
                'codigo' => 'DEP-003',
                'nombre' => 'Finanzas',
                'activo' => true,
                'idUsuarioCreacion' => $userId,
            ],
        ];

        foreach ($departamentos as $departamento) {
            Departamento::updateOrCreate(
                ['codigo' => $departamento['codigo']],
                $departamento,
            );
        }
    }
}