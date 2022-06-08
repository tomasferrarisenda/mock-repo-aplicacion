import { IProductoEnIndicacionMedicaDto } from "./ProductoEnIndicacionMedicaDto";

export interface IAgregadoEnfermeriaDto {
	Id: number,
	IdSucursal: number,
	IdTipoConcepto: number,
	Producto: IProductoEnIndicacionMedicaDto,
	Unidad: string,
	EstaSuspendido: boolean,
	Cantidad: number,
	Observacion: string,
	IdEstadoFarmacia: number,
}