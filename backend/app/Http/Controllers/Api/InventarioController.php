<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InventarioRequest;
use App\Http\Resources\InventarioResource;
use App\Models\Inventario;
use Illuminate\Http\Request;

class InventarioController extends Controller
{
    public function index(Request $request)
    {
        $items = Inventario::when($request->has('activo'), fn($q) => $q->where('activo', $request->activo))->get();
        return InventarioResource::collection($items);
    }

    public function show($id)
    {
        return new InventarioResource(Inventario::findOrFail($id));
    }

    public function store(InventarioRequest $request)
    {
        $item = Inventario::create($request->validated());
        return new InventarioResource($item);
    }

    public function update(InventarioRequest $request, $id)
    {
        $item = Inventario::findOrFail($id);
        $item->update($request->validated());
        return new InventarioResource($item);
    }

    public function destroy($id)
    {
        $item = Inventario::findOrFail($id);
        $item->delete();

        return response()->json([
            'message' => 'Ítem eliminado correctamente.'
        ], 200);
    }

    public function toggleActivo($id)
    {
        $item = Inventario::findOrFail($id);
        $item->activo = !$item->activo;
        $item->save();

        return response()->json([
            'message' => 'Estado del producto actualizado.',
            'activo' => $item->activo
        ]);
    }
}
