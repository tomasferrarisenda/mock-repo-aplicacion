/**
* @author:         rbassi
* @description:    Consulta de duracion de prestaciones
* @type:           Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ConsultaDuracionPrestacionController } from './consultaDuracionPrestacionController';
const ConsultaDuracionPrestacionTemplate = require('./consultaDuracionPrestacionComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
	template: ConsultaDuracionPrestacionTemplate,
	controller: ConsultaDuracionPrestacionController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class ConsultaDuracionPrestacionComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saConsultaDuracionPrestacion', component);
	}
}