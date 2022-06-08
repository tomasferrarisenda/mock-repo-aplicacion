export interface IInternacionParaValidarDto {
	Id?: number,
	NumeroInternado?: number,
	Paciente?: string,
	Cama?: string,
	Habitacion?: string,
	TienePendientes?: boolean,
	PacienteConAlta?: boolean,
	TieneUrgentes?: boolean,
}