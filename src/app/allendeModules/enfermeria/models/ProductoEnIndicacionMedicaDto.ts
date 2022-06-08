export interface IProductoEnIndicacionMedicaDto {
	IdTipoStockeable:number,
	IdStockeable:number,
	CodigoStockeable:string,
	NombreStockeable:string,
	PresentacionStockeable:string,
	EsMultiDosis: boolean,
	Droga: string,
	IdTipoAntibiotico: number,
	EsUrgenteFI: boolean,
	EsAltoRiesgo: boolean,
	TipoAntibiotico?: any
}