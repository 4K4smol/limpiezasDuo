<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;
use App\Http\Requests\ClienteRequest;
use App\Http\Resources\ClienteResource;


class ClienteController extends Controller
{
    // 🟢 Listar todos los clientes (con opción de filtro activo)
    public function index(Request $request)
    {
        $clientes = Cliente::when($request->has('activo'), fn($q) => $q->where('activo', $request->activo))->get();
        return ClienteResource::collection($clientes);
    }

    // 🔍 Obtener un cliente concreto
    public function show($id)
    {
        return new ClienteResource(Cliente::findOrFail($id));
    }

    // 🆕 Crear un nuevo cliente
    public function store(ClienteRequest $request)
    {
        $cliente = Cliente::create($request->validated());
        return new ClienteResource($cliente);
    }

    // ✏️ Actualizar un cliente
    public function update(ClienteRequest $request, $id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->update($request->validated());
        return new ClienteResource($cliente);
    }

    // 🔄 Activar/Desactivar un cliente
    public function toggleActivo($id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->activo = !$cliente->activo;
        $cliente->save();

        return response()->json([
            'message' => 'Estado actualizado correctamente.',
            'activo' => $cliente->activo
        ]);
    }
}
