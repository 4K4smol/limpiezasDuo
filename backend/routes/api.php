<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// --- Autenticación ---
use App\Http\Controllers\Api\AuthController;
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/user', fn(Request $request) => $request->user());

// --- Clientes ---
use App\Http\Controllers\Api\ClienteController;
Route::apiResource('clientes', ClienteController::class);
Route::patch('clientes/{id}/toggle-activo', [ClienteController::class, 'toggleActivo']);
Route::get('clientes/{id}/ubicaciones', [ClienteController::class, 'ubicaciones']);

// --- Empleados ---
use App\Http\Controllers\Api\EmpleadoController;
Route::prefix('empleados')->group(function () {
    Route::get('/', [EmpleadoController::class, 'index']);
    Route::get('{id}', [EmpleadoController::class, 'show']);
    Route::post('/', [EmpleadoController::class, 'store']);
    Route::put('{id}', [EmpleadoController::class, 'update']);
    Route::patch('{id}/toggle', [EmpleadoController::class, 'toggleActivo']);
});

// --- Servicios ---
use App\Http\Controllers\Api\ServicioController;
Route::apiResource('servicios', ServicioController::class)->parameters([
    'servicios' => 'servicio',
]);

// --- Servicios Periódicos ---
use App\Http\Controllers\Api\ServicioPeriodicoController;
Route::prefix('servicios-periodicos')->name('servicios-periodicos.')->group(function () {
    Route::get('/', [ServicioPeriodicoController::class, 'index']);
    Route::get('{sp}', [ServicioPeriodicoController::class, 'show']);
    Route::post('/', [ServicioPeriodicoController::class, 'store']);
    Route::put('{sp}', [ServicioPeriodicoController::class, 'update']);
    Route::post('/{sp}/generar-ordenes', [ServicioPeriodicoController::class, 'generarOrdenes']);
});


// --- Órdenes de Trabajo ---
use App\Http\Controllers\Api\OrdenTrabajoController;
Route::apiResource('ordenes-trabajo', OrdenTrabajoController::class)->parameters([
    'ordenes-trabajo' => 'ordenTrabajo',
]);
Route::patch('ordenes-trabajo/{id}/estado', [OrdenTrabajoController::class, 'cambiarEstado']);
Route::post('ordenes-trabajo/{id}/facturar', [OrdenTrabajoController::class, 'facturar']);

// --- Facturación ---
use App\Http\Controllers\API\FacturaController;
use App\Http\Controllers\Api\FacturaPagoController;
use App\Http\Controllers\Api\FacturaVeriFactuController;
Route::apiResource('facturas', FacturaController::class);
Route::get('facturas/{id}/descargar', [FacturaController::class, 'descargar']);
Route::patch('facturas/{id}/anular', [FacturaController::class, 'anular']);
Route::post('facturas/{id}/pago', [FacturaPagoController::class, 'registrar']);
Route::get('facturas/{id}/exportar-json', [FacturaVeriFactuController::class, 'exportarJson']);

// --- Inventario ---
use App\Http\Controllers\Api\InventarioController;
Route::prefix('inventario')->group(function () {
    Route::get('/', [InventarioController::class, 'index']);
    Route::get('{id}', [InventarioController::class, 'show']);
    Route::post('/', [InventarioController::class, 'store']);
    Route::put('{id}', [InventarioController::class, 'update']);
    Route::delete('{id}', [InventarioController::class, 'destroy']);
    Route::post('{id}/toggle', [InventarioController::class, 'toggleActivo']);
});

// --- Complejidades ---
use App\Http\Controllers\Api\ComplejidadController;
Route::prefix('complejidades')->group(function () {
    Route::get('/', [ComplejidadController::class, 'index']);
    Route::get('{nivel}', [ComplejidadController::class, 'show']);
    Route::post('/', [ComplejidadController::class, 'store']);
    Route::put('{nivel}', [ComplejidadController::class, 'update']);
    Route::delete('{nivel}', [ComplejidadController::class, 'destroy']);
});

// --- Datos del Autónomo (Emisor de Facturas) ---
use App\Http\Controllers\API\DatosAutonomoController;
Route::prefix('emisor')->group(function () {
    Route::get('/', [DatosAutonomoController::class, 'show']);
    Route::put('/', [DatosAutonomoController::class, 'update']);
});

// --- Dashboard ---
Route::get('dashboard/kpis', fn() => response()->json([])); // ← reemplazar por controlador real
Route::get('dashboard/proximas-ordenes', fn() => response()->json([])); // ← reemplazar por controlador real
