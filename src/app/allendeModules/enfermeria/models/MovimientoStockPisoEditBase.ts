import {MovimientoStockPisoDetalleEdit} from './MovimientoStockPisoDetalleEdit';

export interface MovimientoStockPisoEditBase {
	Id?: number,
	IdTipoMovimiento?: number,
	IdSucursal?: number,
	IdSectorInternacion?: number,
	IdDeposito?: number,
	RequiereObservacion?:boolean,
	Observacion?: string,
	IdUsuarioRecepto?: number,
	FechaRecepcion?: string,
	Items?: Array<MovimientoStockPisoDetalleEdit>
	
}