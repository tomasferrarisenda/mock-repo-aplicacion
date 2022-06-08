export interface filtroDefinitivoDTO{
	IdSucursal? : number;
	IdAmbito?: number;
	IdServicio?: number;
	IdMutual?: number;
	IdTipoAfiliado?: number;
	NroDefinitivo?: number;
	NroLote?: number;
	IdTipoFiltroFechaDefinitivo?: number;
	FechaDesde?: Date;
	FechaHasta?: Date;
	CurrentPage ? : number;
	PageSize ? : number;
}
