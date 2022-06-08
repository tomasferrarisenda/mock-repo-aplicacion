/**
 * @author:			mastore
 * @description:	componente tab quirofano farmacia
 * @type:			Component
 **/
import * as angular from 'angular';

import { StockTabQuirofanoController } from './StockTabQuirofanoController';
const listTemplate = require('./sa-stock-tab-quirofano.tpl.html');

const component : angular.IComponentOptions = {
	template: listTemplate,
	bindings: {
        activate: '<'
	},
	controller : StockTabQuirofanoController,
	controllerAs: 'vm'
};
export class StockTabQuirofano {
	public static init(ngModule: angular.IModule){
		ngModule.component('saStockTabQuirofano', component);
	}
}