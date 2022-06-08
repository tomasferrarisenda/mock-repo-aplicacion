/**
* @author: ppautasso
* @description: modulo de integracion para la impresion de zebra
* @type: Module
**/
import * as angular from 'angular';

import { PrintZebraService, BrowserPrintService } from './services';

const modules: angular.IModule[] = [

];


// Se crea y exporta el módulo
export const IntegrationPrintZebraModule = angular.module('integration.printZebra', modules.map(module => module.name));

PrintZebraService.init(IntegrationPrintZebraModule);
BrowserPrintService.init(IntegrationPrintZebraModule);
// Run
IntegrationPrintZebraModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('IntegrationPrintZebra');
	$log.debug('ON.-');
}