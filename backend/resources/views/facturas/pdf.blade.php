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

        .header-left {
            font-weight: bold;
        }

        .header-left a {
            color: #0000EE;
        }

        .logo {
            text-align: right;
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
            width: 70px;
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

        .concepto-tabla {
            margin-top: 5px;
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

        .tipo-pago {
            margin-top: 5px;
        }

        .tipo-pago td {
            padding: 4px;
            font-weight: bold;
        }

        .logo img {
            width: 100px;
        }
    </style>
</head>

<body>

    {{-- Cabecera --}}
    <div class="box">
        <table class="header-table">
            <tr>
                <td class="header-left">
                    CLAUDIO SÁMANO PUEBLA<br>
                    72147983-L<br>
                    C/ General Ceballos 14 1ºD<br>
                    39300 Torrelavega<br>
                    692160710<br>
                    <a href="mailto:limpiezasduo@hotmail.com">limpiezasduo@hotmail.com</a>
                </td>
                <td class="logo">
                    <h3 style="color: #e6b800;"><u>LIMPIEZAS DÚO</u></h3>
                    <img src="{{ public_path('images/logo.png') }}" alt="Logo" style="width: 100px;">
                    {{-- Cambia el path según tu estructura --}}
                </td>
            </tr>
        </table>
    </div>

    {{-- Fecha y Nº de factura --}}
    <div class="box">
        <div class="fecha-factura">
            Torrelavega, {{ $factura->fecha_emision->format('d/m/Y') }}<br>
            Nº Factura: {{ $factura->numero_factura }}
        </div>
    </div>

    {{-- Datos del cliente --}}
    <div class="box">
        <div class="titulo-seccion">Nombre comercial</div>
        <table class="datos-cliente">
            <tr>
                <td class="label">Nombre:</td>
                <td>{{ $factura->cliente->nombre }}</td>
            </tr>
            <tr>
                <td class="label">CIF:</td>
                <td>{{ $factura->cliente->cif }}</td>
            </tr>
            <tr>
                <td class="label">Dirección:</td>
                <td>{{ $factura->cliente->direccion }}</td>
            </tr>
            <tr>
                <td class="label">CP:</td>
                <td>{{ $factura->cliente->cp }}, {{ $factura->cliente->ciudad }}</td>
            </tr>
        </table>
    </div>

    {{-- Conceptos --}}
    <div class="box">
        <div class="titulo-seccion">CONCEPTO:</div>
        <table class="concepto-tabla">
            <thead>
                <tr>
                    <th>Trabajo</th>
                    <th>Precio (sin IVA)</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($factura->detalles as $detalle)
                    <tr>
                        <td>{{ $detalle->descripcion_concepto }}</td>
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
        <div class="titulo-seccion">IMPORTE:</div>
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
                    <td>Retenciones {{ number_format($factura->retencion_porcentaje, 0) }}%</td>
                    <td>-{{ number_format($factura->retencion_importe, 2, ',', '.') }} €</td>
                </tr>
            @endif
            <tr class="importe-final">
                <td>TOTAL A COBRAR</td>
                <td>{{ number_format($factura->total_factura, 2, ',', '.') }} €</td>
            </tr>
        </table>

        <table class="tipo-pago">
            <tr>
                <td>Tipo de pago:</td>
                <td>Metálico ☐</td>
                <td>Cargo a cuenta ☐</td>
            </tr>
        </table>
    </div>

</body>

</html>
{{-- Footer --}}
