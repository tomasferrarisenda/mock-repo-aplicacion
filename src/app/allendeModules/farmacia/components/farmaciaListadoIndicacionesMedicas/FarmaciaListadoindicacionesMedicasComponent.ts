/**
* @author: ppautasso
* @description: componente para listado de indicaciones medicas
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaListadoIndicacionesMedicasController } from './FarmaciaListadoIndicacionesMedicasController';
const FarmaciaListadoIndicacionesMedicasTemplate = require('./FarmaciaListadoIndicacionesMedicasComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaListadoIndicacionesMedicasTemplate,
	controller: FarmaciaListadoIndicacionesMedicasController,
	controllerAs: 'vm',
	bindings: {
		impresionZebraIf: '<?'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class FarmaciaListadoIndicacionesMedicasComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaListadoIndicacionesMedicas', component);
	}
}