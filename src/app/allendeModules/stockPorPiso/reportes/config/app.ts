/**
* @author:         emansilla
* @description:    Configuración para reportes de stock
* @type:           Module
**/
import * as angular from 'angular';
import { StockReportesStates } from './states';

const modules: angular.IModule[] = [];

export const StockReportesConfigModule = angular.module('stockPorPiso.reportes.config', modules.map(module => module.name))
.run(runMethod);
StockReportesStates.init(StockReportesConfigModule);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
    $log = $log.getInstance('StockPorPiso.Reportes.Config');
    $log.debug('ON.-');
}