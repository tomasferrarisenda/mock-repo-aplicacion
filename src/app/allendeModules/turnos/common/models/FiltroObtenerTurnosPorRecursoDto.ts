export interface FiltroObtenerTurnosPorRecursoDto {
	IdServicio?: number,
	IdRecurso?: number,
	IdTipoRecurso?: number,
	IdSucursal?: number,
	FechaDesde?: string,
	FechaHasta?: string,
	SoloAgendaActiva?: boolean,
	ListaDeDias?: Array<number>

}
