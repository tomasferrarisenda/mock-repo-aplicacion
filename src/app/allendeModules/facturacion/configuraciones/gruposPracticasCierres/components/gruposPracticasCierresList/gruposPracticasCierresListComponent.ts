/**
* @author: rbassi
* @description: grupos practicas cierres component
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { gruposPracticasCierresListController } from './gruposPracticasCierresListController';
const gruposPracticasCierresListTemplate = require('./gruposPracticasCierresListComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: gruposPracticasCierresListTemplate,
 controller: gruposPracticasCierresListController,
 controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class gruposPracticasCierresListComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saGruposPracticasCierresList', component);
 }
}	