export interface IEjecucionesIndicacionMedicaDto {
	Id?: number,
	IdSucursal?: number,
	IdTipoConcepto?: number,
	FechaProgramada?: string,
	FechaEjecucion?: string,
	Observaciones?: string,
	IdEstadoFacturacion?: number,
	IdEstadoEjecucion?: number,
	CantidadCargada?: number,
	CantidadEntregada?: number,
	PuedeFacturar?: boolean,
	PuedeDevolver?: boolean,
	PuedeEntregar?: boolean,
	Facturar?: boolean,
	Devolver?: boolean,
	Producto?: string

}
