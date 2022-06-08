import { IIndicacionMedicaConceptoFacturableDto } from ".";

export interface IInternacionConEntregaPendienteDto {
	Id?: number,
	NumeroInternado?: number,
	Paciente?: string,
	IdCama?: number,
	TipoDocumento?: string,
	NumeroDocumento?: string,
	Cama?: string,
	IdHabitacion?: number,
	Habitacion?: string,
	ItemsEntregar?: Array<IIndicacionMedicaConceptoFacturableDto>,
	Entregar?: boolean,
	showSubData?: boolean
}
