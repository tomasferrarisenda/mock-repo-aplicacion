/**
* @author: aminoldo
* @description: Plantilla de Texto
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { PlantillaTextoListController } from './PlantillaTextoListController';
const PlantillaTextoListTemplate = require('./PlantillaTextoListComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: PlantillaTextoListTemplate,
    controller: PlantillaTextoListController,
    controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class PlantillaTextoListComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saPlantillaTextoList', component);
    }
}