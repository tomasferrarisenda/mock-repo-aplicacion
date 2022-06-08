/**
* @author: rbassi
* @description: Receptar Lote Por Filtro Componente
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { loteReceptarPorFiltroListController } from './loteReceptarPorFiltroListController';
const loteReceptarPorFiltroListTemplate = require('./loteReceptarPorFiltroListComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: loteReceptarPorFiltroListTemplate,
 controller: loteReceptarPorFiltroListController,
 controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class loteReceptarPorFiltroListComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saLoteReceptarPorFiltroList', component);
 }
}