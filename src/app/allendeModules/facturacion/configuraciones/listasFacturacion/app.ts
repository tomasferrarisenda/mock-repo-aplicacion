/**
* @author: aminoldo
* @description: Requisitos Administrativos
* @type: Module
**/
import * as angular from 'angular';
import { ListasFacturacionStates } from './config/states';
import { listasFacturacionListComponent } from './components/listasFacturacionList';
import { listasFacturacionEditComponent } from './components/listasFacturacionEdit';
import { itemListasFacturacionEditComponent } from './components/itemListasFacturacionEdit';
import { listasFacturacionDataService } from './services';
import { ListasFacturacionLogicService } from './services';



const config: fw.IConfig[] = [
	ListasFacturacionStates 
];


const components: fw.IComponent[] = [
	listasFacturacionListComponent,
	listasFacturacionEditComponent,
	itemListasFacturacionEditComponent
	//RequisitosAdministrativosListComponent,
	//RequisitosAdministrativosEditComponent
];

const services: fw.IService[] = [
	listasFacturacionDataService,
	ListasFacturacionLogicService
];

// Se crea y exporta el módulo
export const ListasFacturacionModule = angular.module('facturacion.configuraciones.listaFacturacion', []);

config.forEach(c => c.init(ListasFacturacionModule));
components.forEach(c => c.init(ListasFacturacionModule));
services.forEach(s => s.init(ListasFacturacionModule));

// Run
ListasFacturacionModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('facturacion.configuraciones.listaFacturacion');
	$log.debug('ON.-');
}
