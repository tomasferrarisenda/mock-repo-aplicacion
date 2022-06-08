/**
* @author:         hcastro
* @description:    Modulo de gestion de personas
* @type:           Module
**/

import * as angular from 'angular';
import "./config/app";
import "./common/app";
import "./paciente/app";
import "./profesional/app";
import "./prospecto/app";

const modules: angular.IModule[] = [
	
];

// Se crea y exporta el módulo
export const PersonaModule = angular.module('persona', [
	'persona.config',
	'persona.common',
	'persona.paciente',
	'persona.profesional',
	'persona.prospecto'
]);

// Run
PersonaModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Persona');
	$log.debug('ON.-');
}