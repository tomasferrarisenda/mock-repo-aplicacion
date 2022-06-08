/**
* @author:         emansilla
* @description:    Alertas
* @type:           Module
**/
import * as angular from 'angular';

import AlertaLogicService from "./services/AlertaLogicService";

import AlertaListController from "./controllers/AlertaListController";
import DestinatariosAlertaListController from "./controllers/DestinatariosAlertaListController";
import AlertaNewController from "./controllers/AlertaNewController";
import saDestinosAlerta from "./directives/saDestinosAlerta";

import "./config/app";

const controllers: fw.IInitializable[] = [
	DestinatariosAlertaListController,
	AlertaNewController,
	AlertaListController
];

const services: fw.IService[] = [
	AlertaLogicService
]

const directives: fw.IDirective[] = [
	saDestinosAlerta
];

// Se crea y exporta el módulo
export const AlertaModule = angular.module('alerta', ['alerta.config']);

directives.forEach(c => c.init(AlertaModule));
controllers.forEach(c => c.init(AlertaModule));
services.forEach(s => s.init(AlertaModule));

// Run
AlertaModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Alerta');
	$log.debug('ON.-');
}