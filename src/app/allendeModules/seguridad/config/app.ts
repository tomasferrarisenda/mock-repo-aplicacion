/**
* @author:         ppautasso
* @description:    configuraciones de seguridad
* @type:           Module
**/
import * as angular from 'angular';

import states from './states';

const modules: angular.IModule[] = [
	
];

const config: fw.IConfig[] = [
	states
];

// Se crea y exporta el módulo
export const SeguridadConfigModule = angular.module('seguridad.config', modules.map(module => module.name));

config.forEach(c => c.init(SeguridadConfigModule));

// Run
SeguridadConfigModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Seguridad.Config');
	$log.debug('ON.-');
}