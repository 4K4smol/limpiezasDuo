<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Controllers
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\EmpleadoController;
use App\Http\Controllers\Api\InventarioController;
use App\Http\Controllers\Api\ServicioController;
use App\Http\Controllers\Api\ServicioPeriodicoController;
use App\Http\Controllers\Api\OrdenTrabajoController;
use App\Http\Controllers\Api\ComplejidadController;
use App\Http\Controllers\Api\FacturaPagoController;
use App\Http\Controllers\API\FacturaController;
use App\Http\Controllers\API\DatosAutonomoController;
use App\Http\Controllers\Api\FacturaVeriFactuController;

// --- Autenticación ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/user', function (Request $request) {
    return $request->user();
});

// --- Clientes ---
Route::apiResource('clientes', ClienteController::class);
Route::patch('clientes/{id}/toggle-activo', [ClienteController::class, 'toggleActivo']);
Route::get('clientes/{id}/ubicaciones', [ClienteController::class, 'ubicaciones']);

// --- Empleados ---
Route::prefix('empleados')->group(function () {
    Route::get('/', [EmpleadoController::class, 'index']);
    Route::get('/{id}', [EmpleadoController::class, 'show']);
    Route::post('/', [EmpleadoController::class, 'store']);
    Route::put('/{id}', [EmpleadoController::class, 'update']);
    Route::patch('/{id}/toggle', [EmpleadoController::class, 'toggleActivo']);
});

// --- Servicios ---
Route::apiResource('servicios', ServicioController::class)->parameters([
    'servicios' => 'servicio'
]);

// --- Servicios Periódicos ---
Route::prefix('servicios-periodicos')->group(function () {
    Route::get('/', [ServicioPeriodicoController::class, 'index']);
    Route::get('/{id}', [ServicioPeriodicoController::class, 'show']);
    Route::post('/', [ServicioPeriodicoController::class, 'store']);
    Route::put('/{id}', [ServicioPeriodicoController::class, 'update']);
    Route::post('/{sp}/generar-ordenes', [ServicioPeriodicoController::class, 'generarOrdenes']);
});

// --- Órdenes de trabajo ---
Route::apiResource('ordenes-trabajo', OrdenTrabajoController::class)->parameters([
    'ordenes-trabajo' => 'ordenTrabajo'
]);
Route::patch('/ordenes-trabajo/{id}/estado', [OrdenTrabajoController::class, 'cambiarEstado']);
Route::post('/ordenes-trabajo/{id}/facturar', [OrdenTrabajoController::class, 'facturar']);

// --- Facturación ---
Route::apiResource('facturas', FacturaController::class);
Route::get('/facturas/{id}/descargar', [FacturaController::class, 'descargar']);
Route::post('/facturas/{id}/pago', [FacturaPagoController::class, 'registrar']);
Route::patch('/facturas/{id}/anular', [FacturaController::class, 'anular']);
Route::get('/facturas/{id}/exportar-json', [FacturaVeriFactuController::class, 'exportarJson']);

// --- Inventario ---
Route::prefix('inventario')->group(function () {
    Route::get('/', [InventarioController::class, 'index']);
    Route::get('/{id}', [InventarioController::class, 'show']);
    Route::post('/', [InventarioController::class, 'store']);
    Route::put('/{id}', [InventarioController::class, 'update']);
    Route::delete('/{id}', [InventarioController::class, 'destroy']);
    Route::post('/{id}/toggle', [InventarioController::class, 'toggleActivo']);
});

// --- Complejidades ---
Route::prefix('complejidades')->group(function () {
    Route::get('/', [ComplejidadController::class, 'index']);
    Route::get('/{nivel}', [ComplejidadController::class, 'show']);
    Route::post('/', [ComplejidadController::class, 'store']);
    Route::put('/{nivel}', [ComplejidadController::class, 'update']);
    Route::delete('/{nivel}', [ComplejidadController::class, 'destroy']);
});

// --- Datos del emisor (autónomo) ---
Route::prefix('emisor')->group(function () {
    Route::get('/', [DatosAutonomoController::class, 'show']);
    Route::put('/', [DatosAutonomoController::class, 'update']);
});

// --- Dashboard (KPIs, próximas órdenes, etc.) ---
Route::get('/dashboard/kpis', [/*TuDashboardController*/ 'getKpis']);
Route::get('/dashboard/proximas-ordenes', [/*TuOrdenController*/ 'proximas']);
