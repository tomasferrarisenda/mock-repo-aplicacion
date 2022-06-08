/**
* @author:         ppautasso
* @description:    Modulo de farmacia
* @type:           Module
**/
import * as angular from 'angular';
import { EnfermeriaConfigModule } from './config';
import {StockeableDataService, TipoStockeableDataService, TipoDepositoDataService, DepositoDataService} from './services/depositos'
import {EnfermeriaCommonLogicService} from './services/common';
import {MovimientoStockPisoDataService,MovimientosStockDataService,TipoMovimientoStockDataService} from './services/movimientos';
import { EnfermeriaStockPorPisoComponent, EnfermeriaAsignacionComponent, EnfermeriaListadoMovimientosStockComponent, 
	ProductosStockTableComponent, EnfermeriaAsignacionPorAccionTableComponent,EnfermeriaVerDetalleMovimientoComponent,
	EnfermeriaVerAuditoriaMovimientoComponent,EnfermeriaGestionEnfermerasComponent, EnfermeriaNuevoPrestamoEnfermeraComponent, EnfermeriaUpaComponent,
	EnfermeriaVerHistorialPrestamoEnfermeraComponent,EnfermeriaIndicacionesMedicasComponent,EnfermeriaListadoIndicacionesMedicasTabComponent,
	EnfermeriaSuministrarEjecucionModalComponent,EnfermeriaColocarSueroModalComponent,EnfermeriaSeleccionadorInternadosComponent } from './components';
import { SelectorProductoComponent, BuscadorProductoComponent,HistorialMovimientosPorProductoComponent,ImprimirRemitoMovimientoStockComponent,
	BuscadorDinamicoProductoComponent,IndicacionesMedicasEnfermeriaTableComponent,EnfermeriaDevolverParcialAsignacionComponent,BarcodeScanModalEnfermeriaComponent} from './commons'
import {EnfermeriaLogicService, EnfermeriaDataService} from './services';
import {AsignacionTemporalEnfermeraDataService} from './services/red'
import {IndicacionMedicaEnfermeriaDataService} from './services/indicaciones';

const modules = [
	EnfermeriaConfigModule
];

export const EnfermeriaModule = angular.module('enfermeria', modules.map(m => m.name))

// Components
EnfermeriaStockPorPisoComponent.init(EnfermeriaModule);
EnfermeriaAsignacionComponent.init(EnfermeriaModule);
EnfermeriaListadoMovimientosStockComponent.init(EnfermeriaModule);
SelectorProductoComponent.init(EnfermeriaModule);
BuscadorProductoComponent.init(EnfermeriaModule);
ProductosStockTableComponent.init(EnfermeriaModule);
EnfermeriaAsignacionPorAccionTableComponent.init(EnfermeriaModule);
EnfermeriaVerDetalleMovimientoComponent.init(EnfermeriaModule);
EnfermeriaVerAuditoriaMovimientoComponent.init(EnfermeriaModule);
EnfermeriaGestionEnfermerasComponent.init(EnfermeriaModule);
EnfermeriaNuevoPrestamoEnfermeraComponent.init(EnfermeriaModule);
EnfermeriaVerHistorialPrestamoEnfermeraComponent.init(EnfermeriaModule);
EnfermeriaUpaComponent.init(EnfermeriaModule);
HistorialMovimientosPorProductoComponent.init(EnfermeriaModule);
ImprimirRemitoMovimientoStockComponent.init(EnfermeriaModule);
EnfermeriaIndicacionesMedicasComponent.init(EnfermeriaModule);
BuscadorDinamicoProductoComponent.init(EnfermeriaModule);
EnfermeriaListadoIndicacionesMedicasTabComponent.init(EnfermeriaModule);
IndicacionesMedicasEnfermeriaTableComponent.init(EnfermeriaModule);
EnfermeriaDevolverParcialAsignacionComponent.init(EnfermeriaModule);
EnfermeriaSuministrarEjecucionModalComponent.init(EnfermeriaModule);
EnfermeriaColocarSueroModalComponent.init(EnfermeriaModule);
EnfermeriaSeleccionadorInternadosComponent.init(EnfermeriaModule);
BarcodeScanModalEnfermeriaComponent.init(EnfermeriaModule);

// Services
StockeableDataService.init(EnfermeriaModule);
TipoStockeableDataService.init(EnfermeriaModule)
TipoDepositoDataService.init(EnfermeriaModule);
DepositoDataService.init(EnfermeriaModule);
EnfermeriaCommonLogicService.init(EnfermeriaModule);
MovimientosStockDataService.init(EnfermeriaModule);
TipoMovimientoStockDataService.init(EnfermeriaModule);
EnfermeriaDataService.init(EnfermeriaModule);
AsignacionTemporalEnfermeraDataService.init(EnfermeriaModule);

EnfermeriaLogicService.init(EnfermeriaModule);

MovimientoStockPisoDataService.init(EnfermeriaModule);
IndicacionMedicaEnfermeriaDataService.init(EnfermeriaModule);
// Run
EnfermeriaModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('Enfermeria');
	$log.debug('ON.-');
}
