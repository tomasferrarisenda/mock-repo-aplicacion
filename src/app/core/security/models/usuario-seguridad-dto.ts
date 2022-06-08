import { IPacienteUsuarioDto } from "./paciente-usuario-dto";
import { IPermisoUsuarioDto } from "./permiso-usuario-dto";
import { IImpresionDto } from "./impresion-dto";
import { IModuloJerarquicoHabilitadoDto } from "./modulo-jerarquico-habilitado-dto";
import { IEmpresaHabilitadaDto } from "./empresa-habilitada-dto";
import { IPacientesACargoDto } from "./pacientes-cargo-dto";
import { IRecepcionUsuarioDTO } from "./recepcion-usuario-dto";

export interface IUsuarioSeguridadDto extends IEntidadDto {
    UserName?: string;
    Nombre?: string;
    Legajo?: number;

    IdTipo?: number;
    Tipo?: any;

    Permisos?: IPermisoUsuarioDto[];
    Impresiones?: IImpresionDto[];
    Sucursales?: IEntidadDto[];
    Servicios?: IEntidadDto[];
    Modulos?: IModuloJerarquicoHabilitadoDto[];
    EmpresasHabilitadas?: IEmpresaHabilitadaDto[];
    // TODO: agregar tipado
    Recepciones: IRecepcionUsuarioDTO[]; 

    IdPaciente?: number;
    PacientesACargo?: IPacientesACargoDto[];
    Paciente?: IPacienteUsuarioDto;

    IdProfesional?: number;

    DiasHastaQueExpireLaPassword?: number;
}