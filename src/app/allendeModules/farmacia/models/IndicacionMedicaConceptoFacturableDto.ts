import { IProductoAEntregarDto } from "./ProductoAEntregarDto";
import { IConceptoEntregadoDto } from "./ConceptoEntregadoDto";

export interface IIndicacionMedicaConceptoFacturableDto {

	CantidadCargada?: number,
	Producto?: IProductoAEntregarDto,
	Conceptos?: Array<IConceptoEntregadoDto>,
	Entregar?: boolean
}
