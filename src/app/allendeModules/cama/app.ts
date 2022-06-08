/**
* @author:         emansilla
* @description:    Camas
* @type:           Module
**/
import * as angular from 'angular';
import "./config/app";
import "./common/app";
import "./estado/app";
import "./gestion/app";
import "./reportes/app";

// Se crea y exporta el módulo
export const CamaModule = angular.module('cama', [
	'cama.config',
	'cama.common',
	'cama.estado',
	'cama.gestion',
	'cama.reportes'
]);

// Run
CamaModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Cama');
	$log.debug('ON.-');
}