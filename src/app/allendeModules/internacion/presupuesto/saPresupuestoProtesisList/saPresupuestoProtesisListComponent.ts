/**
 * @author:			Ezequiel Mansilla
 * @description:	Lista de presupuesto de protesis
 * @type:			Component
 **/
import * as angular from 'angular';

import { PresupuestoProtesisListController } from './PresupuestoProtesisListController';
const listTemplate = require('./saPresupuestoProtesisListTemplate.html');

export const PresupuestoProtesisListComponent : angular.IComponentOptions = {
	template: listTemplate,
	bindings: {
		idIntervencion : '<',
		btnEditIf : '<?',
		btnPrintIf : '<?'
	},
	controller : PresupuestoProtesisListController
};
export default class {
	public static init(ngModule: angular.IModule){
		ngModule.component('saPresupuestoProtesisList', PresupuestoProtesisListComponent);
	}
}