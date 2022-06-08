import { IProductoEnIndicacionMedicaDto } from "./ProductoEnIndicacionMedicaDto";

export interface IAgregadoEnfermeriaSuministroDto {

	Producto?: IProductoEnIndicacionMedicaDto,
	Unidad?: string,
	Cantidad?: string,
	Observacion?: string,

}

