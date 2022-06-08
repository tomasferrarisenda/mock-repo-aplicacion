/**
* @author:         emansilla
* @description:    Configuraciones de registro legacy
* @type:           Module
**/
import * as angular from 'angular';

import constants from "./constants";
import states from "./states";

const modules: angular.IModule[] = [
	
];

const config: fw.IConfig[] = [
	constants,
	states
];
// Se crea y exporta el módulo
export const RegistroLegacyConfigModule = angular.module('registroLegacy.config', modules.map(module => module.name));

config.forEach(c => c.init(RegistroLegacyConfigModule));

// Run
RegistroLegacyConfigModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('RegistroLegacy.Config');
	$log.debug('ON.-');
}