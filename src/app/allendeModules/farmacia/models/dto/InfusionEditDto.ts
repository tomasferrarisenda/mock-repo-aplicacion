import { IProductoIndicacionMedica } from "..";
import { IAgregadoEditDto } from "./AgregadoEditDto";

export interface IInfusionEditDto {

	IdSucursal?: number,
	IdTipoConcepto?: number,
	IdInternacion?: number,
	Posologia?: string,
	Fecha?: string,
	FechaHora?: string,
	Descripcion?: string,
	EsUrgencia?: boolean,
	EsUrgentePorFarmacia?: boolean,
	Duplicada?: boolean,
	ObservacionMedica?: string,
	ObservacionFarmacia?: string,
	Matricula?: number,
	ProfesionalEfector?: string,
	IdEstado?: number,
	IdEstadoEjecucion?: number,
	IdEstadoFarmacia?: number,
	IdEstadoFacturacion?: number,
	FechaSuspension?: string,
	UsuarioSuspension?: string,
	Producto?: IProductoIndicacionMedica,
	CantidadEntregada?: number,
	CantidadCargada?: number,

	PuedeCargar?: boolean,
	PuedeCambiarProducto?: boolean,
	PuedeCambiarEstadoFarmacia?: boolean,

	Agregados?: Array<IAgregadoEditDto>,
}

