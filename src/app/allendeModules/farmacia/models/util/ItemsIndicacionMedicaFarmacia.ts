import { IEjecucionesIndicacionMedicaDto, IAgregadosIndicacionMedicaDto, IDescartablesIndicacionMedicaDto } from "..";

export interface IItemsIndicacionMedicaFarmacia {

	Ejecuciones?: Array<IEjecucionesIndicacionMedicaDto>,
	Agregados?:  Array<IAgregadosIndicacionMedicaDto>,
	Descartables?:  Array<IDescartablesIndicacionMedicaDto>,
	
}
