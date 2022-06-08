/**
* @author:         emansilla
* @description:    Configuraciones de liquidacion de honorarios
* @type:           Module
**/
import * as angular from 'angular';
import { LiquidacionHonorariosConfiguracionesStates } from './config';
import { ConceptoAjusteModule } from './conceptoAjuste';

const modules = [
	ConceptoAjusteModule
]

export const LiquidacionHonorariosConfiguracionesModule = angular.module('liquidacionHonorarios.configuraciones', modules.map(m => m.name));

LiquidacionHonorariosConfiguracionesStates.init(LiquidacionHonorariosConfiguracionesModule);

// Run
LiquidacionHonorariosConfiguracionesModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('LiquidacionHonorarios.Configuraciones');
	$log.debug('ON.-');
}


