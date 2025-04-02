<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\EmpleadoController;
use App\Http\Controllers\Api\InventarioController;
use App\Http\Controllers\Api\ComplejidadController;
use App\Http\Controllers\API\DatosAutonomoController;
use App\Http\Controllers\API\FacturaController;
use App\Http\Controllers\Api\AuthController; // Asegúrate de crear este controlador
use App\Http\Controllers\Api\OrdenTrabajoController;
use App\Http\Controllers\Api\ServicioController;

Route::post('/login', [AuthController::class, 'login']);

Route::apiResource('servicios', ServicioController::class)->parameters([
    'servicios' => 'servicio' // Vincula el parámetro {servicio} al modelo Servicio
]);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user(); // Devuelve el modelo Usuario autenticado
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    // --- Aquí irían TODAS tus otras rutas API protegidas ---
    // ej. Route::apiResource('/clientes', ClienteController::class);
    Route::get('/dashboard/kpis', [/*TuDashboardController*/ 'getKpis']);
    Route::get('/dashboard/proximas-ordenes', [/*TuOrdenController*/ 'proximas']);
    // ... etc


    Route::apiResource('ordenes-trabajo', OrdenTrabajoController::class)->parameters([
        'ordenes-trabajo' => 'ordenTrabajo' // Asegura que el parámetro coincida con el nombre en el controller (OrdenTrabajo $ordenTrabajo)
    ]);
});

Route::apiResource('facturas', FacturaController::class);

Route::prefix('clientes')->group(function () {
    Route::get('/', [ClienteController::class, 'index']);
    Route::get('/{id}', [ClienteController::class, 'show']);
    Route::post('/', [ClienteController::class, 'store']);
    Route::put('/{id}', [ClienteController::class, 'update']);
    Route::patch('/{id}/toggle', [ClienteController::class, 'toggleActivo']);
});

Route::prefix('empleados')->group(function () {
    Route::get('/', [EmpleadoController::class, 'index']);
    Route::get('/{id}', [EmpleadoController::class, 'show']);
    Route::post('/', [EmpleadoController::class, 'store']);
    Route::put('/{id}', [EmpleadoController::class, 'update']);
    Route::patch('/{id}/toggle', [EmpleadoController::class, 'toggleActivo']);
});

Route::prefix('inventario')->group(function () {
    Route::get('/', [InventarioController::class, 'index']);
    Route::get('/{id}', [InventarioController::class, 'show']);
    Route::post('/', [InventarioController::class, 'store']);
    Route::put('/{id}', [InventarioController::class, 'update']);
    Route::patch('/{id}/toggle', [InventarioController::class, 'toggleActivo']);
});

Route::prefix('complejidades')->group(function () {
    Route::get('/', [ComplejidadController::class, 'index']);
    Route::get('/{nivel}', [ComplejidadController::class, 'show']);
    Route::post('/', [ComplejidadController::class, 'store']);
    Route::put('/{nivel}', [ComplejidadController::class, 'update']);
    Route::delete('/{nivel}', [ComplejidadController::class, 'destroy']);
});

Route::prefix('emisor')->group(function () {
    Route::get('/', [DatosAutonomoController::class, 'show']);
    Route::put('/', [DatosAutonomoController::class, 'update']);
});
