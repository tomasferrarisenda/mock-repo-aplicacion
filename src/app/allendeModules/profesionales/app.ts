/**
* @author:         emansilla
* @description:    Modulo de profesionales
* @type:           Module
**/

import * as angular from 'angular';
import "./config/app";
import "./common/app";
import "./aparatos/app";
import "./equipos/app";
import "./profesionales/app";
import "./sociedadProfesionales/app";
import "./contratosInternos/app";
import "./profesionalesExternos/app";
import{ ProfesionalTecnicoDelServicioModule } from "./tecnicoDelServicio";

const modules: angular.IModule[] = [
	
];

// Se crea y exporta el módulo
export const ProfesionalModule = angular.module('profesionales', [
	'profesionales.config',
	'profesionales.common',
	'profesionales.aparatos',
	'profesionales.equipos',
	'profesionales.profesionales',
	'profesionales.sociedadProfesionales',
	'profesionales.contratosInternos',
	'profesionales.profesionalesExternos',
	ProfesionalTecnicoDelServicioModule.name
]);

// Run
ProfesionalModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Profesional');
	$log.debug('ON.-');
}