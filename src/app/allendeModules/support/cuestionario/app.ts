/**
* @author:         emansilla
* @description:    CUestionario
* @type:           Module
**/

import * as angular from 'angular';
// Services
import CuestionarioDataService from './services/CuestionarioDataService';
import CuestionarioService from './services/CuestionarioService';

import CuestionarioRealizarController from './controllers/CuestionarioRealizarController';
import CuestionarioRealizarExtController from './controllers/CuestionarioRealizarExtController';

import saCuestionarioComponent from './components/cuestionario/saCuestionarioComponent';
import saCuestionarioItemComponent from './components/cuestionarioItem/saCuestionarioItemComponent';
import { AllendeSupportCuestionarioConfigModule } from './config';

export const AllendeSupportCuestionarioModule = angular.module('allende.support.cuestionario', [
	AllendeSupportCuestionarioConfigModule.name
]);

// Services
CuestionarioDataService.init(AllendeSupportCuestionarioModule);
CuestionarioService.init(AllendeSupportCuestionarioModule);
CuestionarioRealizarController.init(AllendeSupportCuestionarioModule);
CuestionarioRealizarExtController.init(AllendeSupportCuestionarioModule);

saCuestionarioComponent.init(AllendeSupportCuestionarioModule);
saCuestionarioItemComponent.init(AllendeSupportCuestionarioModule);

AllendeSupportCuestionarioModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Allende.Support.Cuestionario');
	$log.debug('ON.-');
}