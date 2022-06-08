/**
* @author:         ppautasso
* @description:    App para farmacia home
* @type:           Module
**/
import * as angular from 'angular';
import { FarmaciaHomeStates } from './states';

export const FarmaciaConfigModule = angular.module('Farmacia.config', []);

FarmaciaConfigModule.run(runMethod);
FarmaciaHomeStates.init(FarmaciaConfigModule);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('Farmacia.Config');
	$log.debug('ON.-');
}