export interface ItemStockDepositoParaConfiguracion {
	IdDeposito ?: number,
	IdTipoStockeable ?: number,
	IdStockeable ?: number,
	Codigo?: string,
	Presentacion?: string,
	StockActual?: number,
	StockNormal?: number,
	StockMinimo?: number,
	StockMaximo?: number,
	CantidadMaximaUtilizable?: number
}
