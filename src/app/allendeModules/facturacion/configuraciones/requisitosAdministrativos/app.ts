/**
* @author: aminoldo
* @description: Requisitos Administrativos
* @type: Module
**/
import * as angular from 'angular';
import {FacturacionRequisitosAdministrativosStates} from './config';
import {RequisitosAdministrativosListComponent} from './components/requisitosAdministrativosList/RequisitosAdministrativosListComponent';
import {RequisitosAdministrativosEditComponent} from './components/requisitosAdministrativosEdit/RequisitosAdministrativosEditComponent';
import {RequisitoAdministrativoDataService, RequisitoAdministrativoLogicService} from './services';

const config: fw.IConfig[] = [
    FacturacionRequisitosAdministrativosStates
];


const components: fw.IComponent[] = [
    RequisitosAdministrativosListComponent,
    RequisitosAdministrativosEditComponent
];

const services: fw.IService[] = [
    RequisitoAdministrativoDataService,
    RequisitoAdministrativoLogicService
];

// Se crea y exporta el módulo
export const FacturacionRequisitosAdministrativosModule = angular.module('facturacion.configuraciones.requisitosAdministrativos',[]);


config.forEach(c => c.init(FacturacionRequisitosAdministrativosModule));
components.forEach(c => c.init(FacturacionRequisitosAdministrativosModule));
services.forEach(s => s.init(FacturacionRequisitosAdministrativosModule));

// Run
FacturacionRequisitosAdministrativosModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
 $log = $log.getInstance('Faturacion.Configuraciones.RequisitosAdministrativos');
 $log.debug('ON.-');
}
