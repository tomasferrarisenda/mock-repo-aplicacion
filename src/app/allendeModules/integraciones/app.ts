/**
* @author:         emansilla
* @description:    Integraciones
* @type:           Module
**/

import * as angular from 'angular';
import "./common/app";
import "./config/app";
import "./logs/app";

// Se crea y exporta el módulo
export const IntegracionModule = angular.module('integraciones', [
	'integraciones.common',
	'integraciones.config',
	'integraciones.logs'
]);

// Run
IntegracionModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Integracion');
	$log.debug('ON.-');
}