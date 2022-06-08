
import { IEstadoIndicacionMedicaFarmacia, IEstadoIndicacionMedica, IEstadoFacturacionIndicacionMedica, ITipoIndicacionMedicaDto } from "./dto";
import { IProductoIndicacionMedica } from "./ProductoIndicacionMedicaDto";
import { IEjecucionesIndicacionMedicaDto } from "./EjecucionesIndicacionMedicaDto";
import { IAgregadosIndicacionMedicaDto } from "./AgregadosIndicacionMedicaDto";

export interface IDescartablesIndicacionMedicaDto {
	Id ?: number,
	IdSucursal ?: number,
	IdInternacion ?: number,
	Fecha?: string,
	FechaHora?: string,
	IdTipoConcepto?: number,
	IdEstado?: number,
	TieneUrgencia?: boolean,
	TieneUrgenciaFarmacia?: boolean,

	Duplicada ?: boolean,
	Posologia ?: string,
	MatriculaProfesional ?: number,
	Profesional ?: string,
	IdTipoIndicacion ?: number,
	ObservacionMedica ?: string,
	ObservacionFarmacia ?: string,
	FechaSuspension ?: string,
	UsuarioSuspension ?: string,
	Producto ?: IProductoIndicacionMedica,
		
	Descripcion ?: string,
	PuedeCambiarProducto ?: boolean,
	CantidadCargada ?: number,
	CantidadEntregada ?: number,
	IdEstadoFarmacia ?: number,
	IdEstadoFacturacion ?: number,
	IdEstadoEjecucion ?: number,
	PuedeFacturar ?: boolean,
	PuedeDevolver ?: boolean,
	PuedeEntregar ?: boolean,
	TieneMultiDosis ?: boolean,
	TieneAtbRestringido ?: boolean,
	IdDroga ?: boolean,
	Facturar ?: boolean,
	Devolver ?: boolean,

	Ejecuciones?: Array<IEjecucionesIndicacionMedicaDto>,
	Agregados?:  Array<IAgregadosIndicacionMedicaDto>,
	Descartables?:  Array<IDescartablesIndicacionMedicaDto>,

	EstadoIndicacion?: IEstadoIndicacionMedica,
	EstadoIndicacionFarmacia?: IEstadoIndicacionMedicaFarmacia,
	EstadoFacturacion?: IEstadoFacturacionIndicacionMedica,
	TipoIndicacion?: ITipoIndicacionMedicaDto
}
