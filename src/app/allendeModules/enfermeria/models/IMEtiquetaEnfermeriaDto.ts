import { ProductoEtiquetaEnfermeriaDto } from "./ProductoEtiquetaEnfermeriaDto";
import { AgregadoEtiquetaEnfermeriaDto } from ".";

export interface IIMEtiquetaEnfermeriaDto {

	Id ?: number,
	IdSucursal ?: number,
	IdTipo ?: number,
	Producto ?: ProductoEtiquetaEnfermeriaDto,
	Dosis ?: string,
	Cada ?: string,
	Via ?: string,
	Volumen ?: string,
	Goteo ?: string,
	TipoDocumento?: string,
	NroDocumento?: string,
	Descripcion ?: string,
	Agregados?: Array<AgregadoEtiquetaEnfermeriaDto>,
}