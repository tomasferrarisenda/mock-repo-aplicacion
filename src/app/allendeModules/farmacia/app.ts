/**
* @author:         ppautasso
* @description:    Modulo de recepcion de turnos
* @type:           Module
**/
import * as angular from 'angular';
import { FarmaciaConfigModule } from './config';

import {FarmaciaStockPorPisoContenedorComponent,
		FarmaciaStockComponent,
		FarmaciaConfiguracionStockComponent,FarmaciaConfiguracionProductosTableComponent,
		FarmaciaAgregarProductoAStockComponent,FarmaciaEditarStockNormalDeProductoComponent,
		FarmaciaFacturacionContenedorComponent,FarmaciaFacturacionEditarItemFacturadoComponent,
		FarmaciaAgregarProductoFacturadoAInternadoComponent,FarmaciaVerDetalleProductoFacturadoDeInternadoComponent,
		FarmaciaIndicacionesMedicasComponent,FarmaciaValidacionIndicacionesMedicasComponent,
		FarmaciaDevolucionesIndicacionesMedicasComponent,FarmaciaSeleccionarInternadosConIndicacionesPendientesModalComponent,
		FarmaciaEntregarProductosVentanillaModalComponent,FarmaciaPreparadoIndicacionMedicaModalComponent,
		FarmaciaEntregarProductosPorSectorModalComponent,FarmaciaListadoIndicacionesMedicasComponent,FarmaciaListadoIndicacionesTabComponent,
		FarmaciaImprimirRemitoEntregaProductosComponent,FarmaciaImprimirInformesPorInternadoComponent,FarmaciaVerDetalleMovimientoModalComponent,
		FarmaciaImprimirPrevioEntregaProductosComponent,FarmaciaFacturacionEditarPorcentajesMedicModalComponent} from './components'

import {FarmaciaLogicService,FarmaciaFacturacionDataService,FarmaciaIndicacionesMedicasDataService,
	EstadoEjecucionindicacionMedicaDataService,EstadoFacturacionIndicacionMedicaDataService,
	EstadoIndicacionMedicaDataService,EstadoIndicacionmedicaFarmaciaDataService,TipoIndicacionMedicaDataService,ValidacionIndicacionMedicaDataService,IndicacionMedicaDataService,
	CambiarEstadoFarmaciaIndicacionMedicaDataService,CambiarProductoIndicacionMedicaDataService,EntregarIndicacionMedicaDataService,
	ModoEntregaMovimientoStockDataService,MovimientoStockIndicacionMedicaDataService,TipoAntibioticoDataDataService,EstadoMovimientoStockDataService} from './services';

import {IndicacionesMedicasFarmaciaTableComponent,VerDetalleIndicacionMedicaFarmaciaComponent,VerFacturarDevolverIndicacionComponent} from './commons';

const modules = [
	FarmaciaConfigModule
];

export const FarmaciaModule = angular.module('farmacia', modules.map(m => m.name))

// Components
FarmaciaStockPorPisoContenedorComponent.init(FarmaciaModule);
FarmaciaStockComponent.init(FarmaciaModule);
FarmaciaConfiguracionStockComponent.init(FarmaciaModule);
FarmaciaConfiguracionProductosTableComponent.init(FarmaciaModule);
FarmaciaAgregarProductoAStockComponent.init(FarmaciaModule);
FarmaciaEditarStockNormalDeProductoComponent.init(FarmaciaModule);
FarmaciaFacturacionContenedorComponent.init(FarmaciaModule);
FarmaciaFacturacionEditarItemFacturadoComponent.init(FarmaciaModule);
FarmaciaAgregarProductoFacturadoAInternadoComponent.init(FarmaciaModule);
FarmaciaVerDetalleProductoFacturadoDeInternadoComponent.init(FarmaciaModule);
FarmaciaIndicacionesMedicasComponent.init(FarmaciaModule);
FarmaciaValidacionIndicacionesMedicasComponent.init(FarmaciaModule);
FarmaciaDevolucionesIndicacionesMedicasComponent.init(FarmaciaModule);
FarmaciaSeleccionarInternadosConIndicacionesPendientesModalComponent.init(FarmaciaModule);
FarmaciaEntregarProductosVentanillaModalComponent.init(FarmaciaModule);
FarmaciaPreparadoIndicacionMedicaModalComponent.init(FarmaciaModule);
FarmaciaEntregarProductosPorSectorModalComponent.init(FarmaciaModule);
FarmaciaListadoIndicacionesMedicasComponent.init(FarmaciaModule);
FarmaciaListadoIndicacionesTabComponent.init(FarmaciaModule);
FarmaciaImprimirRemitoEntregaProductosComponent.init(FarmaciaModule);
FarmaciaImprimirInformesPorInternadoComponent.init(FarmaciaModule);
FarmaciaVerDetalleMovimientoModalComponent.init(FarmaciaModule);
FarmaciaImprimirPrevioEntregaProductosComponent.init(FarmaciaModule);
FarmaciaFacturacionEditarPorcentajesMedicModalComponent.init(FarmaciaModule);

//  Components commmon
IndicacionesMedicasFarmaciaTableComponent.init(FarmaciaModule);
VerDetalleIndicacionMedicaFarmaciaComponent.init(FarmaciaModule);
VerFacturarDevolverIndicacionComponent.init(FarmaciaModule);

// Services
FarmaciaLogicService.init(FarmaciaModule);
FarmaciaFacturacionDataService.init(FarmaciaModule);
FarmaciaIndicacionesMedicasDataService.init(FarmaciaModule);
EstadoEjecucionindicacionMedicaDataService.init(FarmaciaModule);
EstadoFacturacionIndicacionMedicaDataService.init(FarmaciaModule);
EstadoIndicacionMedicaDataService.init(FarmaciaModule);
EstadoIndicacionmedicaFarmaciaDataService.init(FarmaciaModule);
TipoIndicacionMedicaDataService.init(FarmaciaModule);
ValidacionIndicacionMedicaDataService.init(FarmaciaModule);
IndicacionMedicaDataService.init(FarmaciaModule);
CambiarEstadoFarmaciaIndicacionMedicaDataService.init(FarmaciaModule);
CambiarProductoIndicacionMedicaDataService.init(FarmaciaModule);
EntregarIndicacionMedicaDataService.init(FarmaciaModule);
ModoEntregaMovimientoStockDataService.init(FarmaciaModule);
MovimientoStockIndicacionMedicaDataService.init(FarmaciaModule);
TipoAntibioticoDataDataService.init(FarmaciaModule);
EstadoMovimientoStockDataService.init(FarmaciaModule);

// Run
FarmaciaModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('Farmacia');
	$log.debug('ON.-');
}
