/**
* @author: ppautasso
* @description: componente para mostrar la lista de revaluo
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RevaluacionPrefacturaListController } from './RevaluacionPrefacturaListController';
const RevaluacionPrefacturaListTemplate = require('./RevaluacionPrefacturaListComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: RevaluacionPrefacturaListTemplate,
 controller: RevaluacionPrefacturaListController,
 controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class RevaluacionPrefacturaListComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saRevaluacionPrefacturaList', component);
 }
}