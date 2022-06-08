/**
* @author: rbassi
* @description: items prefacturados para lote component
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { itemsPrefacturadosParaLoteListController } from './itemsPrefacturadosParaLoteListController';
const itemsPrefacturadosParaLoteListTemplate = require('./itemsPrefacturadosParaLoteListComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: itemsPrefacturadosParaLoteListTemplate,
 controller: itemsPrefacturadosParaLoteListController,
 controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class itemsPrefacturadosParaLoteListComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saItemsPrefacturadosParaLoteList', component);
 }
}	