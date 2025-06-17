<?php

namespace App\Enums;

enum AccionFactura: string
{
    case CREADA         = 'creada';
    case MODIFICADA     = 'modificada';
    case ANULADA        = 'anulada';
    case EXPORTADA_JSON = 'exportada_json';
    case EXPORTADA_XML  = 'exportada_xml';
    case ENVIADA_AEAT   = 'enviada_aeat';
}
