/**
* @author: rbassi
* @description: buscador dinamico de seguros Componente
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { buscadorDinamicoSegurosController } from './buscadorDinamicoSegurosController';
const buscadorDinamicoSegurosTemplate = require('./buscadorDinamicoSegurosComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: buscadorDinamicoSegurosTemplate,
 controller: buscadorDinamicoSegurosController,
 controllerAs: 'vm',
 bindings: {
	busquedaSeguro: '=?',
	loading: '=?'
}
}

// Se agrega el componente al módulo pasado por parámetros
export class buscadorDinamicoSegurosComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('sabuscadorDinamicoSeguros', component);
 }
}
