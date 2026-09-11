<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departamento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class DepartamentoController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Departamento::query()->orderBy('id')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $departamento = Departamento::create($this->validatedData($request));

        return response()->json($departamento, 201);
    }

    public function show(Departamento $departamento): JsonResponse
    {
        return response()->json($departamento);
    }

    public function update(Request $request, Departamento $departamento): JsonResponse
    {
        $departamento->update($this->validatedData($request, $departamento));

        return response()->json($departamento->fresh());
    }

    public function destroy(Departamento $departamento): JsonResponse|Response
    {
        if ($departamento->usuarios()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el departamento porque tiene usuarios asociados.',
            ], 409);
        }

        $departamento->delete();

        return response()->noContent();
    }

    private function validatedData(Request $request, ?Departamento $departamento = null): array
    {
        return $request->validate([
            'codigo' => [
                'required',
                'string',
                'max:255',
                Rule::unique('departamentos', 'codigo')->ignore($departamento),
            ],
            'nombre' => ['required', 'string', 'max:255'],
            'activo' => ['required', 'boolean'],
            'idUsuarioCreacion' => ['required', 'integer'],
        ]);
    }
}