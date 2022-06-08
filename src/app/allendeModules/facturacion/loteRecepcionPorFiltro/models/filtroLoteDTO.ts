export interface filtroLoteDTO{
	IdSucursal? : number;
	IdServicio? : number;
	NroLoteLegacy? : number;
	IdUsuario? : number;
	IdEstado? : number;
	FechaDesde? : Date;
	FechaHasta? : Date;	
	CurrentPage ? : number;
	PageSize ? : number;
}