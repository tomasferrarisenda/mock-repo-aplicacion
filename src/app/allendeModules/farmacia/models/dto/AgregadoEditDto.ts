import { IProductoIndicacionMedica } from "..";

export interface IAgregadoEditDto {
	IdSucursal?: number,
	IdTipoConcepto?: number,
	IdEstado?: number,
	IdEstadoFarmacia?: number,
	IdEstadoFacturacion?: number,
	Producto?: IProductoIndicacionMedica,
	CantidadEntregada?: number,
	Cantidad?: number,
	Observacion?: string,
	CantidadCargada?: number,
	PuedeCargar?: boolean,
	PuedeCambiarProducto?: boolean,
	PuedeCambiarEstadoFarmacia?: boolean,
}


