
import { itemListaFacturacionDTO } from '../models/itemListaFacturacionDTO';

export interface ListaFacturacionEditDTO {
	Id?: number;
	Nombre?: string;
	Descripcion?: string;
	IdTipoPrefacturableDeLaLista?: number;
	NombrePrefacturableDeLaLista?: string;
	Items?: GridViewDto<itemListaFacturacionDTO>;
	CurrentPage?: number;
	PageSize?: number;
}
