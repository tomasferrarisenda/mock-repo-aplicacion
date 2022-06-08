/**
* @author:         ppautasso
* @description:    Usuarios de seguridad
* @type:           Module
**/
import * as angular from 'angular';

import './common/app';
import './config/app';
import './gestion/app';

// Se crea y exporta el módulo
export const SeguridadUsuarioModule = angular.module('seguridad.usuario', [
	'seguridad.usuario.common',
	'seguridad.usuario.config',
	'seguridad.usuario.gestion'
]);

// Run
SeguridadUsuarioModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Seguridad.Usuario');
	$log.debug('ON.-');
}