<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cargo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CargoController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Cargo::query()->orderBy('id')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $cargo = Cargo::create($this->validatedData($request));

        return response()->json($cargo, 201);
    }

    public function show(Cargo $cargo): JsonResponse
    {
        return response()->json($cargo);
    }

    public function update(Request $request, Cargo $cargo): JsonResponse
    {
        $cargo->update($this->validatedData($request, $cargo));

        return response()->json($cargo->fresh());
    }

    public function destroy(Cargo $cargo): JsonResponse
    {
        $cargo->delete();

        return response()->noContent();
    }

    private function validatedData(Request $request, ?Cargo $cargo = null): array
    {
        return $request->validate([
            'codigo' => [
                'required',
                'string',
                'max:255',
                Rule::unique('cargos', 'codigo')->ignore($cargo),
            ],
            'nombre' => ['required', 'string', 'max:255'],
            'activo' => ['required', 'boolean'],
            'idUsuarioCreacion' => ['required', 'integer'],
        ]);
    }
}