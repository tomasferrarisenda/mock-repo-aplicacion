export interface ITomaDosificacionEditDto {
	
	IdSucursal?: number,
	IdTipoConcepto?: number,
	IdDosificacion?: number,
	FechaProgramada?: string,
	Fecha?: string,
	NombreEnfermera?: string,
	Observaciones?: string,
	IdEstadoEjecucion?: number,
	IdEstadoFacturacion?: number,
	CantidadCargada?: number,
	CantidadEntregada?: number,
	PuedeCargar?: boolean;
	Producto?: any;
}