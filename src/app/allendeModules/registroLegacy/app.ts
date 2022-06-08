/**
* @author:         emansilla
* @description:    Registro de medicos
* @type:           Module
**/
import * as angular from 'angular';

import LegacyRegisterService from "./services/LegacyRegisterService";
import MedicoRegisterController from "./controllers/MedicoRegisterController";
import UsuarioRegisterController from "./controllers/UsuarioRegisterController";

import { RegistroLegacyConfigModule } from "./config";

const modules: angular.IModule[] = [
	RegistroLegacyConfigModule
];

const controllers: fw.IInitializable[] = [
	LegacyRegisterService,
	MedicoRegisterController,
	UsuarioRegisterController
];

// Se crea y exporta el módulo
export const RegistroLegacyModule = angular.module('registroLegacy', modules.map(module => module.name));

controllers.forEach(c => c.init(RegistroLegacyModule));

// Run
RegistroLegacyModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('RegistroLegacy');
	$log.debug('ON.-');
}