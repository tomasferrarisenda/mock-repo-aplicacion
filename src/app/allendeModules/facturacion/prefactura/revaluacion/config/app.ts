/**
* @author:         ppautasso
* @description:    App para revaluacion home
* @type:           Module
**/
import * as angular from 'angular';
import { RevaluacionHomeStates } from './states';

export const RevaluacionConfigModule = angular.module('revaluacion.config', []);

RevaluacionConfigModule.run(runMethod);
RevaluacionHomeStates.init(RevaluacionConfigModule);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('Revaluacion.Config');
	$log.debug('ON.-');
}