/**
* @author:         emansilla
* @description:    Telefonos
* @type:           Module
**/
import * as angular from 'angular';

import TelefonosDataService from "./services/TelefonosDataService";
import TelefonosLogicService from "./services/TelefonosLogicService";
import TelefonosModalController from "./controllers/TelefonosModalController";
import saTelefonosNuevo from "./directives/saTelefonosNuevo";

export const AllendeSupportTelefonosModule = angular.module('allende.support.telefonos', []);

TelefonosDataService.init(AllendeSupportTelefonosModule);
TelefonosLogicService.init(AllendeSupportTelefonosModule);
TelefonosModalController.init(AllendeSupportTelefonosModule);
saTelefonosNuevo.init(AllendeSupportTelefonosModule);

// Run
AllendeSupportTelefonosModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Allende.Support.Telefonos');
	$log.debug('ON.-');
}