/**
* @author: ppautasso
* @description: componente para bar code scannner
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { BarCodeScannerController } from './BarCodeScannerController';
const BarCodeScannerTemplate = require('./BarcodeScannerComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: BarCodeScannerTemplate,
	controller: BarCodeScannerController,
	controllerAs: 'vm',
	bindings:{
		scanResult: '&',
		typeScan: '<'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class BarCodeScannerComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saBarCodeScanner', component);
	}
}