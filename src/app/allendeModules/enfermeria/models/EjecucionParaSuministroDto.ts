import { IProductoEnIndicacionMedicaDto } from "./ProductoEnIndicacionMedicaDto";

export interface IEjecucionParaSuministroDTo {
	Id?: number,
	IdSucursal?: number,
	IdEstadoEjecucion?: number,
	FechaProgramada?: string,
	Observaciones?: string,
	Hidratacion?: string,

	Posologia?: string,
	ObservacionMedica?: string,
	Producto?: IProductoEnIndicacionMedicaDto,

	NumeroInternado?: number,
	Paciente?: string,
	Cama?: string,
	NumeroCama?: number,
	Habitacion?: string,
	NumeroHabitacion?: number,
	NumeroPiso?: number,
}