/**
 * @author:         emansilla
 * @description:    Nomenclador
 * @type:           Module
 **/

import * as angular from 'angular';
import "./config/app";
import "./nacional/app";
import "./cie/app";

// Se crea y exporta el módulo
export const NomencladorModule = angular.module('nomenclador', [
	'nomenclador.config',
	'nomenclador.nacional',
	'nomenclador.cie'
]);

// Run
NomencladorModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Name');
	$log.debug('ON.-');
}