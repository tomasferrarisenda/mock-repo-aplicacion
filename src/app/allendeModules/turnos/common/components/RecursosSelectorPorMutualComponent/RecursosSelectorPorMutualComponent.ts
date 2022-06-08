/**
* @author: pablo pautasso
* @description: componente tipo selector, para recursos filtrados por mutual
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RecursosSelectorPorMutualController } from './RecursosSelectorPorMutualController';
const RecursosSelectorPorMutualTemplate = require('./RecursosSelectorPorMutualComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: RecursosSelectorPorMutualTemplate,
	controller: RecursosSelectorPorMutualController,
	controllerAs: 'vm',
	bindings: {

		loading: '=?',
		criterioBusqueda: '=?',
		afiliaciones: '<?',
		prestaciones: '<?',
		especialidad: '<?',
		sucursal: '<?',
		disabled: '=?',
		clean: '&?',
		ifLabel: '=?',
		model: '=',
		onModelChange: '&?',
		limpiar: '=?',
		buscadorRecursoEnServiciosIf: '<?',
		onBuscarRecursosOk: '&?',
		tipoRecurso: '=?'

	}, 
}

// Se agrega el componente al módulo pasado por parámetros
export class RecursosSelectorPorMutualComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saRecursosSelectorPorMutual', component);
	}
}