
export interface IPacienteHCEDto extends IEntidadDto {
	Apellido?: string,
	TipoDocumento?: string,
	NroDocumento?: string,
	FechaNacimiento?: string,
	Email?: string,
	Sexo?: IEntidadDto,
	Telefono?: string,
}
