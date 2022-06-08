export interface IEjecucionIndicacionMedicaEnfermeriaDto {
	Id: number,
	IdSucursal: number,
	IdTipoConcepto: number,
	FechaProgramada: string,
	FechaEjecucion: string,
	Observaciones: string,
	NombreEnfermera: string,
	IdEstadoEjecucion: number,

	//campos para front
	EstadoEjecucion?: any
}