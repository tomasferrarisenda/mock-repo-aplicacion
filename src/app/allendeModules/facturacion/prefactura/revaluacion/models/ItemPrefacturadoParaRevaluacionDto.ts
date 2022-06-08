export interface IItemPrefacturadoParaRevaluacionDto {

	Id?: number,
	IdPrefactura?: number,
	Codigo?: string,
	Prefacturable?: string,
	FechaRealizacion?: string,

	Derecho?: number,
	HonorarioEspecialista?: number,
	HonorarioAnestesista?: number,
	HonorarioAyudante?: number,
	ImporteGlobal?: number,
	ImporteTotal?: number,
	
	PorcentajeCoseguro?: number,
	ImporteCoseguro?: number,
	Cantidad?: number,

	NroAutorizacion?: string,
	NroAfiliado?: string,
	Paciente?: string,
	NroDocumento?: string,
	ObservacionAnomalia?: string,
	ServicioEfector?: string,
	Sucursal?: string,
	IdEstadoItemPrefacturado?: number,
	PlanMutual?: string,
	IdTipoAfiliado?: number,
	ProfesionalEfector?: string,
}