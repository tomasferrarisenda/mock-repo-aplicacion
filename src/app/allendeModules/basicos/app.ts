/**
* @author:         emansilla
* @description:    Basicos
* @type:           Module
**/

import * as angular from 'angular';
import { AdministradorDocumentosModule } from "./documentos";
import "./config/app";
// import "./common/app";
import "./centroServicio/app";
import "./especialidades/app";
import "./prestaciones/app";
import "./recursos/app";
import "./servicios/app";
import "./plantillaTexto/app";
import "./gestionRecepcion/app";
import "./bateriaEstudios/app"; //este items es provisorio deberia ir a Historia Clinica

const modules: angular.IModule[] = [
	
];

// Se crea y exporta el módulo
export const BasicoModule = angular.module('basicos', [
	'basicos.config',
	// 'basicos.common',
	'basicos.centroServicios',
	'basicos.especialidades',
	AdministradorDocumentosModule.name,
	'basicos.prestaciones',
	'basicos.recursos',
	'basicos.servicios',
	'basicos.plantillaTexto',
	'basicos.gestionRecepcion',
	'basicos.bateriaEstudios',
]);

// Run
BasicoModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Basico');
	$log.debug('ON.-');
}