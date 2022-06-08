/**
* @author:         mastore
* @description:    Guardia
* @type:           Module
**/
import * as angular from 'angular';
import "./config/app";
// import "./common/app";
import "./atencion/app";
import "./administracion/app";

// Se crea y exporta el módulo
export const GuardiaModule = angular.module('guardia', [
	'guardia.config',
	// 'guardia.common',
	'guardia.atencion',
	'guardia.administracion'
]);

// Run
GuardiaModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Guardia');
	$log.debug('ON.-');
}