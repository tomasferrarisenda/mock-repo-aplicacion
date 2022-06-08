/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de Row
 * @type:			Service
 **/
import * as angular from 'angular';
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('Row', Row);

		Row.$inject = ['Logger'];
		
		function Row ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('Row');
			// $log.debug('ON.-');

			class Row {
				data : any;
				clickAction: any;
				filterExpression: any;
				callClickAction : Function = this.callClickActionFn;
				callFilterExpression: Function = this.callFilterExpressionFn;
				idElements: string;

				constructor(data) {
					this.data = data.data;
					this.clickAction = data.clickAction;
					this.filterExpression = data.filterExpression;
					this.idElements = data.idElements;
				}

				private callClickActionFn (pRow, pClickIf) {
					if (pClickIf && this.clickAction && angular.isFunction(this.clickAction)) {
						this.clickAction({row:pRow});
					}
				}

				private callFilterExpressionFn(pRow) {
					if(this.filterExpression && angular.isFunction(this.filterExpression)) return this.filterExpression({row:pRow})
					else return true;
				}
	
				public static build (data) : Row{
					// agregar alguna validacion de creación
					return new Row(data);
				}
	
				public isValid() : boolean {
					return true;
				}
			}

			return Row;
		}
	};

	return module;
})();