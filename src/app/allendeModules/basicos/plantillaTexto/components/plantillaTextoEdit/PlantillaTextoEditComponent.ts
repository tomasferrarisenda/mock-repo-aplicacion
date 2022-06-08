/**
* @author: rodrigo
* @description: planilla texto edit
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { PlantillaTextoEditController } from './PlantillaTextoEditController';
const PlantillaTextoEditTemplate = require('./PlantillaTextoEditComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: PlantillaTextoEditTemplate,
	controller: PlantillaTextoEditController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class PlantillaTextoEditComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saPlantillaTextoEdit', component);
	}
}		