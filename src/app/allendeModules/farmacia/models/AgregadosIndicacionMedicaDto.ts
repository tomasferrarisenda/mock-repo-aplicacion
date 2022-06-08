import { IProductoIndicacionMedica } from ".";

export interface IAgregadosIndicacionMedicaDto {

	Id?: number,
	IdSucursal?: number,
	IdTipoConcepto?: number,
	Producto?: IProductoIndicacionMedica,
	PuedeCambiarProducto?: boolean,
	Unidad?: string,
	EstaSuspendido?: boolean,
	IdEstadoFarmacia?: number,
	IdEstadoFacturacion?: number,
	CantidadCargada?: number,
	CantidadEntregada?: number,
	Cantidad?: number,
	Observacion?: number,
	IdDroga?: number,
	PuedeFacturar?: boolean,
	PuedeDevolver?: boolean,
	PuedeEntregar?: boolean,
	Facturar?: boolean,
	Devolver?: boolean
}
