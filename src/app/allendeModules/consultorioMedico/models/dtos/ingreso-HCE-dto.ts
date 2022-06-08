import { IProfesionalHCEDto } from './profesional-HCE-dto';
import { IPacienteHCEDto } from '.';

export interface IIngresoHCEDto extends IEntidadDto {
	PuedeIngresar?: boolean,
	MotivoIngresoNoValido?: string,
	Paciente?: IPacienteHCEDto,
	Profesional?: IProfesionalHCEDto,
	IdEventoAtencion?: number,
	IdOrigenEvento?: number,
	IdTipoOrigenEvento?: number,
	TienePermisoParaEditarEditar?: boolean,
	ServicioDelEvento?: IEntidadDto,
}
