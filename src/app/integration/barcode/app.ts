/**
* @author: ppautass y emansilla
* @description: modulo para integracion de barcode scan
* @type: Module
**/
import * as angular from 'angular';

// Se crea y exporta el módulo
export const BarCodeModule = angular.module('integration.barCode', []);

import {BarCodeScannerComponent} from './components';

// Run
BarCodeModule.run(runMethod);

// Components
BarCodeScannerComponent.init(BarCodeModule);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('BarCode');
	$log.debug('ON.-');
}