import { IRecepcionUsuarioDTO } from "./recepcion-usuario-dto";
import { IModuloJerarquicoHabilitadoDto } from "./modulo-jerarquico-habilitado-dto";
import { IPermisoUsuarioDto } from "./permiso-usuario-dto";
import { IImpresionDto } from "./impresion-dto";
import { IEmpresaHabilitadaDto } from "./empresa-habilitada-dto";

export interface CurrentUser {
	userName?: string;
	name?: string;
	sucursales: IEntidadDto[];
	servicios?: IEntidadDto[];
	recepciones?: IRecepcionUsuarioDTO[];
	id?: any;
	employeeId?: any;
	modules?: IModuloJerarquicoHabilitadoDto[];
	permisos?: IPermisoUsuarioDto[];
	impresiones?: IImpresionDto[];
	empresas?: IEmpresaHabilitadaDto[];

	fr?: IAuthData;

	/**
	 * Empresa actual. 
	 */
	IdEmpresa?: number;
}

export interface IAuthData {
	_fra?: string;
	_frr?: string;
}