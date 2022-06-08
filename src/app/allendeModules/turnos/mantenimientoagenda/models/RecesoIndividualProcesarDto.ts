import { ITurnoParaAplicarRecesoIndividualDto } from ".";

export interface IRecesoIndividualProcesarDto {

	IdRecurso?: number,
	IdTipoRecurso?: number,
	IdServicio?: number,
	IdSucursal?: number,
	FechaDesde?: string,
	FechaHasta?: string,
	TurnosParaAplicar?: Array<ITurnoParaAplicarRecesoIndividualDto>,
}
