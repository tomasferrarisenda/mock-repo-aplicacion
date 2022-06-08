/**
* @author:         emansilla
* @description:    Config de modulo liquidación de honorarios
* @type:           Module
**/
import * as angular from 'angular';
import { LiquidacionHonorariosStates } from './states';

export const LiquidacionHonorariosConfigModule = angular.module('liquidacionHonorarios.config', []);

LiquidacionHonorariosStates.init(LiquidacionHonorariosConfigModule);

// Run
LiquidacionHonorariosConfigModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('LiquidacionHonorarios.Config');
	$log.debug('ON.-');
}