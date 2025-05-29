<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InventarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_item'     => 'required|string|max:100',
            'descripcion'     => 'nullable|string',
            'cantidad_actual' => 'required|integer|min:0',
            'stock_minimo'    => 'required|integer|min:0',
            'unidad'          => 'required|string|max:20',
            'ubicacion'       => 'nullable|string|max:100',
            'activo'          => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_item.required' => 'El nombre del producto es obligatorio.',
            'cantidad_actual.min'  => 'La cantidad no puede ser negativa.',
            'stock_minimo.min' => 'El stock no puede ser negativo.',
        ];
    }
}
