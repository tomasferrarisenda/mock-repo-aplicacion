export interface ITurnoParaAplicarRecesoIndividualDto {
	Id: number,
	Fecha: string,
	Hora: string,
	HoraEnMinutos: number,
	DuracionIndividual: number,
	IdEstado: number,
	IdSucursal: number,
	Paciente: string,
	MutualYPlan: string,
	TipoTurno: string,
	ST: string,
	EsSobreTurno: boolean,
	Prestaciones: string,
	FechaAlta: string,
	Duracion: string,
	ConRecesoIndividual: boolean,
	IdRecesoIndividual: number,
}




