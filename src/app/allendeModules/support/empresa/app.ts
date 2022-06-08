/**
* @author:         emansilla
* @description:    Empresas
* @type:           Module
**/
import * as angular from 'angular';

// Services
import EmpresaDataService from "./services/EmpresaDataService";
import EmpresaLogicService from "./services/EmpresaLogicService";
import EmpresaAuthService from "./services/EmpresaAuthService";

// Controllers
import EmpresaNewController from "./controllers/EmpresaNewController";

export const AllendeSupportEmpresaModule = angular.module('allende.support.empresa', []);

// Services
EmpresaDataService.init(AllendeSupportEmpresaModule);
EmpresaLogicService.init(AllendeSupportEmpresaModule);
EmpresaAuthService.init(AllendeSupportEmpresaModule);

// Controllers
EmpresaNewController.init(AllendeSupportEmpresaModule);

// Run
AllendeSupportEmpresaModule.run(runMethod);
runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Allende.Support.Empresa');
	$log.debug('ON.-');
}