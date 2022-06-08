/**
* @author:         emansilla
* @description:    Internacion
* @type:           Module
**/

import * as angular from 'angular';
import "./config/app";
import "./common/app";
import "./preadmision/app";
import "./admision/app";
import "./internado/app";
import "./autorizacion/app";
import "./reportes/app";
import "./presupuesto/app";

// Se crea y exporta el módulo
export const InternacionModule = angular.module('internacion',[
	'internacion.config',
	'internacion.common',
	'internacion.preadmision',
	'internacion.admision',
	'internacion.internado',
	'internacion.autorizacion',
	'internacion.reportes',
	'internacion.presupuesto'
]);

// Run
InternacionModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Internacion');
	$log.debug('ON.-');
}