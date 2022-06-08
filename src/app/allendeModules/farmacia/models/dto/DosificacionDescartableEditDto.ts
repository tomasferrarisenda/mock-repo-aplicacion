import { IProductoIndicacionMedica } from "..";

export interface IDosificacionDescartableEditDto {
	IdSucursal?: number,
	IdTipoConcepto?: number,
	IdDosificacionPadre?: number,
	Producto?: IProductoIndicacionMedica,
	IdEstadoFacturacion?: number,
	CantidadCargada?: number,
	CantidadEntregada?: number,
	Cantidad?: number,
	PuedeCargar?: number
}

