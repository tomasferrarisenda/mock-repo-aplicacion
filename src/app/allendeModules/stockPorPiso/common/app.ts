
import * as angular from 'angular';
import states from "./config/states";

import { 
	UbicacionMedicaDataService,
	UbicacionPisoDataService,
	UbicacionDataService,
	MovimientoStockDataService,
	PedidoFarmaciaVentanillaDataService,
	MaterialDataService,
	GrupoFarmaciaDataService,
	DosificacionDataService,
	AgregadoDataService,
	EnfermeraDataService,
    FacturacionMedicamentoDataService,
	UbicacionDetalleStockDataService,
	StockCommonDataService,
	UbicacionScrapDataService,
	PrescripcionDataService,
	PedidoFarmaciaDataService,
	StockCommonLogicService
} from './services';

export const StockCommonModule = angular.module('stockPorPiso.common', [])

states.init(StockCommonModule);

// Services
UbicacionMedicaDataService.init(StockCommonModule);
UbicacionPisoDataService.init(StockCommonModule);
UbicacionDataService.init(StockCommonModule);
MovimientoStockDataService.init(StockCommonModule);
PedidoFarmaciaVentanillaDataService.init(StockCommonModule);
MaterialDataService.init(StockCommonModule);
GrupoFarmaciaDataService.init(StockCommonModule);
DosificacionDataService.init(StockCommonModule);
AgregadoDataService.init(StockCommonModule);
EnfermeraDataService.init(StockCommonModule);
FacturacionMedicamentoDataService.init(StockCommonModule);
UbicacionDetalleStockDataService.init(StockCommonModule);
StockCommonDataService.init(StockCommonModule);
UbicacionScrapDataService.init(StockCommonModule);
PrescripcionDataService.init(StockCommonModule);
PedidoFarmaciaDataService.init(StockCommonModule);
StockCommonLogicService.init(StockCommonModule);

StockCommonModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log) {
	$log = $log.getInstance("StockPorPiso.Common");
	$log.debug('ON.-');
}