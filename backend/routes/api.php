<?php

use App\Http\Controllers\Api\CargoController;
use App\Http\Controllers\Api\DepartamentoController;
use App\Http\Controllers\Api\UsuarioController;
use Illuminate\Support\Facades\Route;

Route::apiResource('departamentos', DepartamentoController::class);
Route::apiResource('cargos', CargoController::class);
Route::apiResource('usuarios', UsuarioController::class);