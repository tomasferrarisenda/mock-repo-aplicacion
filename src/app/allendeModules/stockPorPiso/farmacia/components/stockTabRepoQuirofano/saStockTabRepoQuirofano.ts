/**
 * @author:			mastore
 * @description:	componente tab quirofano farmacia
 * @type:			Component
 **/
import * as angular from 'angular';

import { StockTabRepoQuirofanoController } from './StockTabRepoQuirofanoController';
const listTemplate = require('./sa-stock-tab-repo-quirofano.tpl.html');

const component : angular.IComponentOptions = {
	template: listTemplate,
	bindings: {
        activate: '<' 
	},
	controller : StockTabRepoQuirofanoController,
	controllerAs: 'vm'
};
export class StockTabRepoQuirofano {
	public static init(ngModule: angular.IModule){
		ngModule.component('saStockTabRepoQuirofano', component);
	}
}