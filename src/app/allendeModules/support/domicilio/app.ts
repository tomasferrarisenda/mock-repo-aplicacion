/**
* @author:         emansilla
* @description:    Domicilios
* @type:           Module
**/
import * as angular from 'angular';

import DomicilioDataService from "./services/DomicilioDataService";
import DomicilioLogicService from "./services/DomicilioLogicService";
import DomicilioModalController from "./controllers/DomicilioModalController";
import saDomicilio from "./directives/saDomicilio";

export const AllendeSupportDomicilioModule = angular.module('allende.support.domicilio', []);

DomicilioDataService.init(AllendeSupportDomicilioModule);
DomicilioLogicService.init(AllendeSupportDomicilioModule);
DomicilioModalController.init(AllendeSupportDomicilioModule);
saDomicilio.init(AllendeSupportDomicilioModule);

AllendeSupportDomicilioModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Allende.Support.Domicilio');
	$log.debug('ON.-');
}