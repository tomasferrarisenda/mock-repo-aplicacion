export interface ListaFacturacionListDto {
	Id?: number;
	Nombre?: string;
	Descripcion?: string;
	IdTipoPrefacturableDeLaLista?: number;
	NombreTipoPrefacturableDeLaLista?: string;
	CurrentPage?: number;
	PageSize?: number ; 
}