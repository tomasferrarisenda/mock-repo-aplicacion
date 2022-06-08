/**
* @author:         emansilla
* @description:    Financiadores
* @type:           Module
**/

import * as angular from 'angular';
import "./config/app";
import "./convenio/app";
import "./homologaciones/app";
import "./organizacion/app";
import "./mutual/app";

// Se crea y exporta el módulo
export const FinanciadorModule = angular.module('financiadores', [
	'financiadores.config',
	'financiadores.convenios',
	'financiadores.homologaciones',
	'financiadores.organizacion',
	'financiadores.mutual',
]);

// Run
FinanciadorModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Financiador');
	$log.debug('ON.-');
}