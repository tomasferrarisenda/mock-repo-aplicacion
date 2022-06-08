/**
* @author: aminoldo
* @description: Lista de Requisitos Administrativos
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RequisitosAdministrativosListController } from './RequisitosAdministrativosListController';
const RequisitosAdministrativosListTemplate = require('./RequisitosAdministrativosListComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: RequisitosAdministrativosListTemplate,
 controller: RequisitosAdministrativosListController,
 controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class RequisitosAdministrativosListComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saRequisitosAdministrativosList', component);

 // En html se usa como sa-unidades-arancelarias-list
   }
}