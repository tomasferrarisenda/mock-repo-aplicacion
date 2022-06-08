/**
* @author:         ppautasso
* @description:    App para enfermeria home
* @type:           Module
**/
import * as angular from 'angular';
import { EnfermeriaHomeStates } from './states';

export const EnfermeriaConfigModule = angular.module('enfermeria.config', []);

EnfermeriaConfigModule.run(runMethod);
EnfermeriaHomeStates.init(EnfermeriaConfigModule);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('Enfermeria.Config');
	$log.debug('ON.-');
}