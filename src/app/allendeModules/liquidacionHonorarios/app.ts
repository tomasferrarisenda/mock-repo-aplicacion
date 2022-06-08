/**
* @author:         emansilla
* @description:    Liquidacion de honorarios
* @type:           Module
**/
import * as angular from 'angular';
import { LiquidacionHonorariosConfigModule } from './config';
import { LiquidacionHonorariosConfiguracionesModule } from './configuraciones';
import { LiquidacionHonorariosContratosInternosModule } from './contratosInternos';

const modules = [
	LiquidacionHonorariosConfigModule,
	LiquidacionHonorariosConfiguracionesModule,
	LiquidacionHonorariosContratosInternosModule
];

export const LiquidacionHonorariosModule = angular.module('liquidacionHonorarios', modules.map(m => m.name));

// Run
LiquidacionHonorariosModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('LiquidacionHonorarios');
	$log.debug('ON.-');
}