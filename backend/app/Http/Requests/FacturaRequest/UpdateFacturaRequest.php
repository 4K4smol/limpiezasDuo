<?php

namespace App\Http\Requests\FacturaRequest;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFacturaRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Si usas políticas de autorización, cámbialo. De momento dejamos acceso libre:
        return true;
    }

    public function rules(): array
    {
        return [
            'id_cliente' => 'sometimes|exists:clientes,id_cliente',
            'items' => 'sometimes|array|min:1',
            'items.*.descripcion_concepto' => 'required_with:items|string|max:255',
            'items.*.cantidad' => 'required_with:items|numeric|min:0.01',
            'items.*.precio_unitario' => 'required_with:items|numeric|min:0',

            'iva_porcentaje' => 'sometimes|numeric|min:0|max:100',
            'retencion_porcentaje' => 'nullable|numeric|min:0|max:100',
            'forma_pago' => ['nullable', 'in:metálico,transferencia,domiciliación'],
            // 'fecha_emision' => 'nullable|date', // Si se puede actualizar la fecha
        ];
    }

    public function messages(): array
    {
        return [
            'id_cliente.exists' => 'El cliente seleccionado no existe.',
            'items.*.descripcion_concepto.required_with' => 'Cada ítem debe tener una descripción.',
            'items.*.cantidad.required_with' => 'Cada ítem debe tener una cantidad.',
            'items.*.precio_unitario.required_with' => 'Cada ítem debe tener un precio unitario.',
        ];
    }
}
