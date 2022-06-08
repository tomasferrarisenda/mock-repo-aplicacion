import { ProductoEtiquetaEnfermeriaDto } from ".";

export interface AgregadoEtiquetaEnfermeriaDto {

	Id?: number,
	IdSucursal?: number,
	Producto?: ProductoEtiquetaEnfermeriaDto,
	Unidad?: string,
	Cantidad?: string,
}


