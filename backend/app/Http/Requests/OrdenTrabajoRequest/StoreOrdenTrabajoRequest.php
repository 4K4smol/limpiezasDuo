<?php

namespace App\Http\Requests\OrdenTrabajoRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrdenTrabajoRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Permitir siempre, la autorización real se hace con middleware (Sanctum)
        return true;
    }

    public function rules(): array
    {
        return [
            'id_cliente' => ['required', 'integer', Rule::exists('clientes', 'id_cliente')],
            'id_ubicacion' => ['required', 'integer', Rule::exists('ubicaciones_cliente', 'id_ubicacion')], // Podrías validar que la ubicación pertenezca al cliente
            'id_empleado' => ['nullable', 'integer', Rule::exists('empleados', 'id_empleado')],
            'fecha_programada' => ['nullable', 'date_format:Y-m-d'],
            'hora_programada' => ['nullable', 'date_format:H:i', 'required_with:fecha_programada'], // Requiere hora si hay fecha
            'estado' => ['sometimes', 'string', 'max:50', Rule::in(['Pendiente', 'Programada', 'En Curso', 'Completada', 'Cancelada'])], // Ajusta estados válidos
            'observaciones' => ['nullable', 'string'],
            'detalles' => ['required', 'array', 'min:1'], // Requiere al menos un detalle
            'detalles.*.id_servicio' => ['required', 'integer', Rule::exists('servicios', 'id_servicio')],
            // Opcional: Validar horas si se envían al crear
            'detalles.*.horas_realizadas' => ['sometimes', 'numeric', 'min:0.25', 'max:99.99'],
        ];
    }

     /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'id_cliente.required' => 'El cliente es obligatorio.',
            'id_cliente.exists' => 'El cliente seleccionado no existe.',
            'id_ubicacion.required' => 'La ubicación es obligatoria.',
            'id_ubicacion.exists' => 'La ubicación seleccionada no existe.',
            'id_empleado.exists' => 'El empleado seleccionado no existe.',
            'fecha_programada.date_format' => 'La fecha programada debe tener el formato AAAA-MM-DD.',
            'hora_programada.date_format' => 'La hora programada debe tener el formato HH:MM.',
            'hora_programada.required_with' => 'Se requiere la hora si se especifica una fecha programada.',
            'estado.in' => 'El estado proporcionado no es válido.',
            'detalles.required' => 'Debe añadir al menos un servicio a la orden.',
            'detalles.array' => 'Los detalles de los servicios deben ser una lista.',
            'detalles.*.id_servicio.required' => 'Debe seleccionar un servicio para cada detalle.',
            'detalles.*.id_servicio.exists' => 'Uno de los servicios seleccionados no existe.',
            'detalles.*.horas_realizadas.numeric' => 'Las horas realizadas deben ser un número.',
        ];
    }
}
