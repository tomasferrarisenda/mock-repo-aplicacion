/**
* @author: rbassi
* @description: Buscador dinamico de usuarios
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { buscadorDinamicoUsuarioController } from './buscadorDinamicoUsuarioController';
const buscadorDinamicoUsuarioTemplate = require('./buscadorDinamicoUsuarioComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: buscadorDinamicoUsuarioTemplate,
 controller: buscadorDinamicoUsuarioController,
 controllerAs: 'vm',
 bindings: {
	busquedaUsuario: '=?',
	loading: '=?',
	otroColaborador: '<',
}
}

// Se agrega el componente al módulo pasado por parámetros
export class buscadorDinamicoUsuarioComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saBuscadorDinamicoUsuario', component);
 }
}