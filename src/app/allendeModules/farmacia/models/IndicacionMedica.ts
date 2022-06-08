import { IProductoIndicacionMedica, IEjecucionesIndicacionMedicaDto } from ".";
import { IEstadoIndicacionMedica, IEstadoIndicacionMedicaFarmacia, IEstadoFacturacionIndicacionMedica, ITipoIndicacionMedicaDto } from "./dto";
import { IAgregadosIndicacionMedicaDto } from "./AgregadosIndicacionMedicaDto";
import { IDescartablesIndicacionMedicaDto } from "./DescartablesIndicacionMedicaDto";

export interface IIndicacionMedica {
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

	IdTipoIndicacion ?: number,

	Producto ?: IProductoIndicacionMedica,
		
	Descripcion ?: string,
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