/**
* @author:         emansilla
* @description:    Modulo de reportes para stock
* @type:           Module
**/
import * as angular from 'angular';
import { StockReportesConfigModule } from './config';
import { AuditoriaIndicacionesComponent, IndicacionSuministradaListComponent } from './components';
import { IndicacionesSuministradasReporteDataService } from './services';

const modules: angular.IModule[] = [
    StockReportesConfigModule
];

const components: fw.IComponent[] = [
    AuditoriaIndicacionesComponent,
    IndicacionSuministradaListComponent
];

const services: fw.IService[] = [
    IndicacionesSuministradasReporteDataService
];

export const StockReportesModule = angular.module('stockPorPiso.reportes', modules.map(module => module.name))

components.forEach(c => c.init(StockReportesModule));
services.forEach(s => s.init(StockReportesModule));

// Run
StockReportesModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
    $log = $log.getInstance('StockPorPiso.Reportes');
    $log.debug('ON.-');
}