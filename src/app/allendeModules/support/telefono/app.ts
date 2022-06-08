/**
* @author:         emansilla
* @description:    Telefonos
* @type:           Module
**/
import * as angular from 'angular';
import TelefonoDataService from "./services/TelefonoDataService";
import TelefonoLogicService from "./services/TelefonoLogicService";
import TelefonoModalController from "./controllers/TelefonoModalController";
import saTelefonos from "./directives/saTelefonos";

export const AllendeSupportTelefonoModule = angular.module('allende.support.telefono', []);

TelefonoDataService.init(AllendeSupportTelefonoModule);
TelefonoLogicService.init(AllendeSupportTelefonoModule);
TelefonoModalController.init(AllendeSupportTelefonoModule);
saTelefonos.init(AllendeSupportTelefonoModule);

// Run
AllendeSupportTelefonoModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Allende.Support.Telefono');
	$log.debug('ON.-');
}