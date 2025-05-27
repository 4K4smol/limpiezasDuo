<?php

namespace App\Http\Requests\ServicioPeriodicoRequest;

use Illuminate\Foundation\Http\FormRequest;


class StoreServicioPeriodicoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id_cliente'           => ['required', 'exists:clientes,id_cliente'],
            'periodicidad_mensual' => ['required', 'in:' . \App\Enums\PeriodicidadMensual::values()],
            'activo'               => ['boolean'],

            'programaciones'                   => ['required', 'array'],
            'programaciones.*.id_servicio'     => ['required', 'exists:servicios,id_servicio'],
            'programaciones.*.id_ubicacion'    => ['required', 'exists:ubicaciones_cliente,id_ubicacion'],
            'programaciones.*.semana_mensual'  => ['required', 'integer', 'between:1,4'],
            'programaciones.*.dia_hora' => ['required', 'date_format:Y-m-d\TH:i'],
        ];
    }

    public function messages(): array
    {
        return [
            'id_cliente.required' => 'Debes seleccionar un cliente.',
            'id_cliente.exists' => 'El cliente seleccionado no existe.',
            'periodicidad_mensual.required' => 'Indica la periodicidad mensual.',
            'periodicidad_mensual.in' => 'La periodicidad debe ser 1, 2 o 4 veces/mes.',
            'programaciones.required' => 'Debes definir las programaciones.',
            'programaciones.array' => 'Las programaciones deben ser un arreglo.',

            'programaciones.*.id_servicio.required' => 'Selecciona un servicio.',
            'programaciones.*.id_servicio.exists' => 'El servicio seleccionado no existe.',
            'programaciones.*.id_ubicacion.required' => 'Selecciona una ubicación.',
            'programaciones.*.id_ubicacion.exists' => 'La ubicación seleccionada no existe.',
            'programaciones.*.semana_mensual.required' => 'Indica la semana del mes.',
            'programaciones.*.semana_mensual.integer' => 'La semana debe ser un número entero.',
            'programaciones.*.semana_mensual.between' => 'La semana debe estar entre 1 y 4.',
            'programaciones.*.dia_hora.required' => 'Indica el día y la hora.',
            'programaciones.*.dia_hora.date_format' => 'La fecha y hora debe tener el formato correcto (YYYY-MM-DDTHH:MM).',
        ];
    }

    /** Hook extra para verificar longitud y duplicados */
    public function withValidator($validator)
    {
        $validator->after(function ($v) {
            $periodicidad = (int) $this->periodicidad_mensual;
            $programaciones = $this->input('programaciones', []);

            // ① mismo número de líneas que periodicidad
            if (count($programaciones) !== $periodicidad) {
                $v->errors()->add(
                    'programaciones',
                    "Debes definir exactamente {$periodicidad} programaciones."
                );
            }

            // ② evitar duplicar servicio + semana
            $dupes = collect($programaciones)
                ->groupBy(fn($p) => $p['id_servicio'] . '-' . $p['semana_mensual'])
                ->filter(fn($g) => $g->count() > 1);

            if ($dupes->isNotEmpty()) {
                $v->errors()->add(
                    'programaciones',
                    'No repitas el mismo servicio en la misma semana.'
                );
            }
        });
    }
}
