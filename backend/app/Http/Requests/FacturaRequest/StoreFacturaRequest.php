<?php

namespace App\Http\Requests\FacturaRequest;

use Illuminate\Foundation\Http\FormRequest;

class StoreFacturaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // o añade lógica de autenticación si lo necesitas
    }

    public function rules(): array
    {
        return [
            'id_cliente' => 'required|exists:clientes,id_cliente',
            'items' => 'required|array|min:1',
            'items.*.descripcion_concepto' => 'required|string|max:255',
            'items.*.cantidad' => 'required|numeric|min:0.01',
            'items.*.precio_unitario' => 'required|numeric|min:0.01',
            'iva_porcentaje' => 'required|numeric|min:0|max:100',
            'retencion_porcentaje' => 'nullable|numeric|min:0|max:100',
            'forma_pago' => 'nullable|string|max:100',
            // 'fecha_emision' => 'nullable|date_format:Y-m-d',
        ];
    }

    public function messages(): array
    {
        return [
            'id_cliente.required' => 'El campo cliente es obligatorio.',
            'id_cliente.exists' => 'El cliente seleccionado no existe.',

            'items.required' => 'Debes añadir al menos un concepto o servicio.',
            'items.array' => 'Los ítems deben enviarse como un array.',
            'items.*.descripcion_concepto.required' => 'Cada ítem debe tener una descripción.',
            'items.*.cantidad.required' => 'Cada ítem debe tener una cantidad.',
            'items.*.cantidad.numeric' => 'La cantidad debe ser un número.',
            'items.*.precio_unitario.required' => 'Cada ítem debe tener un precio unitario.',
            'items.*.precio_unitario.numeric' => 'El precio unitario debe ser un número.',

            'iva_porcentaje.required' => 'El porcentaje de IVA es obligatorio.',
            'iva_porcentaje.numeric' => 'El IVA debe ser un valor numérico.',

            'retencion_porcentaje.numeric' => 'La retención debe ser un valor numérico.',
            'forma_pago.string' => 'La forma de pago debe ser texto.',
            // 'fecha_emision.date_format' => 'La fecha debe tener el formato YYYY-MM-DD.',
        ];
    }
}
