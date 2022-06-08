import { IAgregadoEnfermeriaSuministroDto, IColocacionSueroDto } from ".";

export interface IInfusionParaColocarSueroDto {
	Id?: number,
	IdSucursal?: number,
	ObservacionMedica?: string,
	FechaHora?: string,
	ExtraPlan?: boolean,
	PlanAlternativo?: boolean,
	Posologia?: string,
	Agregados?: Array<IAgregadoEnfermeriaSuministroDto>,
	ColocacionesRealizadas?: Array<IColocacionSueroDto>,

	NuevaColocacion?: IColocacionSueroDto,

	NumeroInternado?: number,
	Paciente?: string,
	Cama?: string,
	NumeroCama?: number,
	Habitacion?: string,
	NumeroHabitacion?: number,
	NumeroPiso?: number,
}