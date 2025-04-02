<?php

namespace App\Http\Requests\OrdenTrabajoRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrdenTrabajoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // 'sometimes' hace que la regla solo aplique si el campo está presente
        return [
            'id_cliente' => ['sometimes', 'required', 'integer', Rule::exists('clientes', 'id_cliente')],
            'id_ubicacion' => ['sometimes', 'required', 'integer', Rule::exists('ubicaciones_cliente', 'id_ubicacion')],
            'id_empleado' => ['nullable', 'integer', Rule::exists('empleados', 'id_empleado')],
            'fecha_programada' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'hora_programada' => ['sometimes', 'nullable', 'date_format:H:i'],
            'estado' => ['sometimes', 'required', 'string', 'max:50', Rule::in(['Pendiente', 'Programada', 'En Curso', 'Completada', 'Cancelada'])],
            'observaciones' => ['sometimes', 'nullable', 'string'],
             // Nota: Actualizar detalles suele ser más complejo y a veces se maneja con endpoints específicos
            // 'detalles' => ['sometimes', 'array'],
            // 'detalles.*.id_servicio' => ['sometimes','required', 'integer', Rule::exists('servicios', 'id_servicio')],
            // 'detalles.*.horas_realizadas' => ['sometimes', 'numeric', 'min:0.25'],
        ];
    }

    // Puedes añadir mensajes personalizados si quieres, igual que en StoreOrdenTrabajoRequest
}
