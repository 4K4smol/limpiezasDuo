<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Factura #{{ $factura->numero_factura }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            padding: 30px;
            color: #000;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .box {
            border: 2px solid black;
            padding: 10px;
            margin-bottom: 15px;
        }

        .header-table td {
            vertical-align: top;
        }

        .logo img {
            max-width: 125px;
            max-height: 125px;
            display: block;
            margin: 0 auto;
        }

        .fecha-factura {
            text-align: right;
            font-weight: bold;
        }

        .datos-cliente td {
            padding: 3px 0;
        }

        .datos-cliente .label {
            font-weight: bold;
            width: 80px;
        }

        .titulo-seccion {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .concepto-tabla th,
        .concepto-tabla td,
        .importe-tabla td {
            border: 1px solid black;
            padding: 6px;
        }

        .importe-tabla td {
            text-align: right;
        }

        .importe-tabla td:first-child {
            text-align: left;
        }

        .importe-final {
            font-weight: bold;
            background-color: #D3D3D3;
        }

        .tipo-pago td {
            padding: 4px;
            font-weight: bold;
        }
    </style>
</head>

<body>

    {{-- Cabecera --}}
    <div class="box">
        <table class="header-table" style="width: 100%;">
            <tr>
                {{-- Datos de empresa --}}
                <td style="width: 60%; line-height: 1.6;">
                    <div style="font-size: 14px; font-weight: bold;">
                        {{ config('empresa.nombre') }}
                    </div>
                    <div>NIF: {{ config('empresa.nif') }}</div>
                    <div>{{ config('empresa.direccion') }}</div>
                    <div>{{ config('empresa.cp') }} {{ config('empresa.ciudad') }}</div>
                    <div>{{ config('empresa.telefono') }}</div>
                    <div>{{ config('empresa.email') }}</div>
                </td>

                {{-- Logo y marca --}}
                <td style="width: 40%; text-align: right;">
                    <div style="font-size: 16px; font-weight: bold; color: #000;">
                        {{ strtoupper(config('empresa.nombre_comercial')) }}
                    </div>
                    @if (file_exists(public_path('images/logo.png')))
                        <img src="{{ public_path('images/logo.png') }}" alt="Logo"
                            style="max-width: 90px; margin-top: 10px;">
                    @else
                        <div style="margin-top: 20px; font-size: 10px; color: #999;">Logo no disponible</div>
                    @endif
                </td>
            </tr>
        </table>
    </div>


    {{-- Fecha y número --}}
    <div class="box">
        <div class="fecha-factura">
            {{ config('empresa.ciudad') }}, {{ $factura->fecha_emision->format('d/m/Y') }}<br>
            Nº Factura: {{ $factura->numero_factura }}
        </div>
    </div>

    {{-- Cliente --}}
    <div class="box">
        <div class="titulo-seccion">Datos del Cliente</div>
        <table class="datos-cliente">
            <tr>
                <td class="label">Nombre:</td>
                <td>{{ e($factura->cliente->nombre) }}</td>
            </tr>
            <tr>
                <td class="label">NIF:</td>
                <td>{{ e($factura->cliente->cif) }}</td>
            </tr>
            <tr>
                <td class="label">Dirección:</td>
                <td>{{ e($factura->cliente->direccion) }}</td>
            </tr>
            <tr>
                <td class="label">CP/Ciudad:</td>
                <td>{{ e($factura->cliente->cp) }}, {{ e($factura->cliente->ciudad) }}</td>
            </tr>
        </table>
    </div>

    {{-- Conceptos --}}
    <div class="box">
        <div class="titulo-seccion">Detalle de Conceptos</div>
        <table class="concepto-tabla">
            <thead>
                <tr>
                    <th>Concepto</th>
                    <th>Precio (sin IVA)</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($factura->detalles as $detalle)
                    <tr>
                        <td>{{ e($detalle->descripcion_concepto) }}</td>
                        <td>{{ number_format($detalle->subtotal, 2, ',', '.') }} €</td>
                    </tr>
                @endforeach
                <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>{{ number_format($factura->base_imponible, 2, ',', '.') }} €</strong></td>
                </tr>
            </tbody>
        </table>
    </div>

    {{-- Importes --}}
    <div class="box">
        <div class="titulo-seccion">Resumen de Importe</div>
        <table class="importe-tabla">
            <tr>
                <td>Base imponible</td>
                <td>{{ number_format($factura->base_imponible, 2, ',', '.') }} €</td>
            </tr>
            <tr>
                <td>IVA {{ number_format($factura->iva_porcentaje, 0) }}%</td>
                <td>{{ number_format($factura->iva_importe, 2, ',', '.') }} €</td>
            </tr>
            @if ($factura->retencion_porcentaje)
                <tr>
                    <td>Retención {{ number_format($factura->retencion_porcentaje, 0) }}%</td>
                    <td>-{{ number_format($factura->retencion_importe, 2, ',', '.') }} €</td>
                </tr>
            @endif
            <tr class="importe-final">
                <td>Total a cobrar (con impuestos)</td>
                <td>{{ number_format($factura->total_factura, 2, ',', '.') }} €</td>
            </tr>
        </table>

        {{-- Forma de pago --}}
        <table class="tipo-pago" style="margin-top: 10px;">
            <tr>
                <td>Forma de pago:</td>
                <td>[{!! $factura->forma_pago === 'metálico' ? '✔' : '&nbsp;' !!}] Metálico</td>
                <td>[{!! $factura->forma_pago === 'transferencia' ? '✔' : '&nbsp;' !!}] Transferencia</td>
                <td>[{!! $factura->forma_pago === 'domiciliación' ? '✔' : '&nbsp;' !!}] Domiciliación</td>
            </tr>
        </table>
    </div>

</body>

</html>
