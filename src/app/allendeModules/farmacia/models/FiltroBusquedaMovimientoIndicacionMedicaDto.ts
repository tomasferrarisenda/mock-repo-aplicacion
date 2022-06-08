export interface IFiltroBusquedaMovimientoIndicacionMedicaDto {
	FechaDesde?: string,
	FechaHasta?: string,
	IdInternacion?: number,
	IdTipoMovimiento?: number,
	IdEstadoMovimiento?: number,
	IdSectorInternacion?: number,
	IdModoEntrega?: number,
	CurrentPage?: number,
	PageSize?: number 
}
