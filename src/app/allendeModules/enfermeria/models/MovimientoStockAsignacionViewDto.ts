import { MovimientoStockDetalleAsignacionViewDto } from ".";

export interface MovimientoStockAsignacionViewDto {
		Id?: number,
        EstadoMovimientoStock?: string,
        DepositoOrigen?: string,
        Fecha?: string,
        Usuario?: string,
        Observacion?: string,
        ObservacionDevolucion?: string,
        DestinatarioMovimientoStock?: string,
        Items?: Array<MovimientoStockDetalleAsignacionViewDto>
}