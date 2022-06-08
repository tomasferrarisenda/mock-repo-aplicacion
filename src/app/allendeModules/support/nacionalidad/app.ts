/**
* @author:         emansilla
* @description:    Nacionalidades
* @type:           Module
**/
import * as angular from 'angular';

import NacionalidadDataService from "./services/NacionalidadDataService";
import NacionalidadLogicService from "./services/NacionalidadLogicService";
import NacionalidadModalController from "./controllers/NacionalidadModalController";
import saNacionalidad from "./directives/saNacionalidad";

export const AllendeSupportNacionalidadModule = angular.module('allende.support.nacionalidad', []);

NacionalidadDataService.init(AllendeSupportNacionalidadModule);
NacionalidadLogicService.init(AllendeSupportNacionalidadModule);
NacionalidadModalController.init(AllendeSupportNacionalidadModule);
saNacionalidad.init(AllendeSupportNacionalidadModule);

AllendeSupportNacionalidadModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Allende.Support.Nacionalidad');
	$log.debug('ON.-');
}