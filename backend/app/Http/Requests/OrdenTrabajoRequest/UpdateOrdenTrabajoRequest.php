<?php

namespace App\Http\Requests\OrdenTrabajoRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\EstadoOrden;
use Illuminate\Validation\Rules\Enum;

class UpdateOrdenTrabajoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_cliente' => ['sometimes', 'integer', Rule::exists('clientes', 'id_cliente')],
            'id_ubicacion' => ['sometimes', 'integer', Rule::exists('ubicaciones_clientes', 'id_ubicacion')],
            'id_empleado' => ['nullable', 'integer', Rule::exists('empleados', 'id_empleado')],
            'fecha_programada' => ['nullable', 'date_format:Y-m-d'],
            'hora_programada' => ['nullable', 'date_format:H:i', 'required_with:fecha_programada'],
            'estado' => ['sometimes', new Enum(EstadoOrden::class)],
            'observaciones' => ['nullable', 'string'],
            'detalles' => ['required', 'array', 'min:1'],
            'detalles.*.id_servicio' => ['required', 'integer', Rule::exists('servicios', 'id_servicio')],
            'detalles.*.horas_realizadas' => ['sometimes', 'numeric', 'min:0.25', 'max:99.99'],
        ];
    }

    public function messages(): array
    {
        return [
            'id_cliente.exists' => 'El cliente no existe.',
            'id_ubicacion.exists' => 'La ubicación no existe.',
            'id_empleado.exists' => 'El empleado no existe.',
            'fecha_programada.date_format' => 'La fecha debe tener el formato AAAA-MM-DD.',
            'hora_programada.date_format' => 'La hora debe tener el formato HH:MM.',
            'hora_programada.required_with' => 'La hora es obligatoria si hay una fecha.',
            'estado' => 'El estado no es válido.',
            'detalles.required' => 'Debe añadir al menos un servicio.',
            'detalles.array' => 'Los detalles deben ser una lista.',
            'detalles.*.id_servicio.required' => 'Debe seleccionar un servicio.',
            'detalles.*.id_servicio.exists' => 'Uno de los servicios no existe.',
            'detalles.*.horas_realizadas.numeric' => 'Las horas deben ser numéricas.',
        ];
    }
}
