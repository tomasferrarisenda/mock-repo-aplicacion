export interface IndicacionSuministradaReporteVista {
    Id: number;
    IdTipo: number;
    Internado: number;
    Codigo: number;
    Descripcion: string;
    PrecioVenta: number;
    IdSucursal: number;
    CantidadSuministradaEnfermeria: number;
    StockRealFarmacia: number;
    CantidadFacturada: number;
    DiferenciaRealVsSuministrado: number;
    DiferenciaSuministradoVsFacturado: number;
}