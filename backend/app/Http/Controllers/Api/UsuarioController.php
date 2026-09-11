<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UsuarioController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Usuario::query()
                ->with(['departamento', 'cargo'])
                ->orderBy('id')
                ->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $usuario = Usuario::create($this->validatedData($request));

        return response()->json($usuario->load(['departamento', 'cargo']), 201);
    }

    public function show(Usuario $usuario): JsonResponse
    {
        return response()->json($usuario->load(['departamento', 'cargo']));
    }

    public function update(Request $request, Usuario $usuario): JsonResponse
    {
        $usuario->update($this->validatedData($request, $usuario));

        return response()->json($usuario->fresh()->load(['departamento', 'cargo']));
    }

    public function destroy(Usuario $usuario): JsonResponse
    {
        $usuario->delete();

        return response()->noContent();
    }

    private function validatedData(Request $request, ?Usuario $usuario = null): array
    {
        return $request->validate([
            'usuario' => [
                'required',
                'string',
                'max:255',
                Rule::unique('usuarios', 'usuario')->ignore($usuario),
            ],
            'primerNombre' => ['required', 'string', 'max:255'],
            'segundoNombre' => ['nullable', 'string', 'max:255'],
            'primerApellido' => ['required', 'string', 'max:255'],
            'segundoApellido' => ['nullable', 'string', 'max:255'],
            'idDepartamento' => ['required', 'integer', 'exists:departamentos,id'],
            'idCargo' => ['required', 'integer', 'exists:cargos,id'],
        ]);
    }
}