/**
* @author:         emansilla
* @description:    Contratos internos de liquidacion de honorarios
* @type:           Module
**/
import * as angular from 'angular';

export const LiquidacionHonorariosContratosInternosModule = angular.module('liquidacionHonorarios.contratosInternos', []);

// Run
LiquidacionHonorariosContratosInternosModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('LiquidacionHonorarios.ContratosInternos');
	$log.debug('ON.-');
}