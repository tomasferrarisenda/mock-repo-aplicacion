import { IIndicacionMedicaConceptoFacturableDto } from "./IndicacionMedicaConceptoFacturableDto";

export interface IEntregaFarmaciaDto {

	IdSector?: number,
	IdModoEntrega?: number,
	IdUsuarioRecepta?: number,
	ItemsEntregar?:Array<IIndicacionMedicaConceptoFacturableDto>
}
