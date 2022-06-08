/**
* @author: ppautassso
* @description: componente de configuracion de productos de stock 
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaConfiguracionProductosTableController } from './FarmaciaConfiguracionProductosTableController';
const FarmaciaConfiguracionProductosTableTemplate = require('./FarmaciaConfiguracionProductosTableComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: FarmaciaConfiguracionProductosTableTemplate,
    controller: FarmaciaConfiguracionProductosTableController,
    controllerAs: 'vm',
    bindings:{
        data: '<',
        titulogrid: '@?',
        btnClick: '&?',
        clickEdit: '&?',
        editCantidad: '&?',
        delProducto: '&?',
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class FarmaciaConfiguracionProductosTableComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saFarmaciaConfiguracionProductosTable', component);
    }
}