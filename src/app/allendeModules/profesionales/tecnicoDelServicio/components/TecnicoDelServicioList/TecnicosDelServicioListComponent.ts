/**
* @author: crusso
* @description: Tecnico del Servicio
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { TecnicosDelServicioListController } from './TecnicosDelServicioListController';
const TecnicosDelServicioTemplate = require('./TecnicosDelServicioListComponent.html');
//const FacturacionCuentasListTemplate = require('./FacturacionCuentaListComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: TecnicosDelServicioTemplate,
	controller: TecnicosDelServicioListController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class TecnicosDelServicioListComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saTecnicosServicioList', component);
	}
}