<?php

namespace App\Http\Requests\ServicioRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Servicio;

class UpdateServicioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $servicioId = $this->route('servicio') instanceof Servicio
            ? $this->route('servicio')->id_servicio
            : $this->route('servicio');

        return [
            'nombre_servicio' => [
                'sometimes', 'required', 'string', 'max:150',
                Rule::unique('servicios', 'nombre_servicio')->ignore($servicioId, 'id_servicio')
            ],
            'descripcion' => ['sometimes', 'nullable', 'string'],
            'precio_hora' => ['sometimes', 'required', 'numeric', 'min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
            'activo' => ['sometimes', 'required', 'boolean'],
            'servicio_padre_id' => ['nullable', 'exists:servicios,id_servicio'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_servicio.required' => 'El nombre del servicio es obligatorio.',
            'nombre_servicio.unique' => 'Ya existe otro servicio con este nombre.',
            'precio_hora.required' => 'El precio por hora es obligatorio.',
            'precio_hora.regex' => 'El precio debe tener hasta dos decimales.',
            'activo.boolean' => 'El campo activo debe ser verdadero o falso.',
            'servicio_padre_id.exists' => 'El servicio padre seleccionado no existe.',
        ];
    }
}
