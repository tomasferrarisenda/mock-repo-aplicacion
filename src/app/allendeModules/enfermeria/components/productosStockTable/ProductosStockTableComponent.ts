/**
* @author: ppautasso
* @description: Componente para tabla de productos de sotck
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ProductosStockTableController } from './ProductosStockTableController';
const ProductosStockTableTemplate = require('./ProductosStockTableComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: ProductosStockTableTemplate,
    controller: ProductosStockTableController,
    controllerAs: 'vm',
    bindings:{
        data: '<',
        titulogrid: '@?',
        colorRow: '<?',
        btnClick: '&?',
        clickMenuAgregarProducto: '&?',
        tipoAccion: '<',
        dataSelected: '=?',
        deposito: '<?'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class ProductosStockTableComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saProductosStockTable', component);
    }
}