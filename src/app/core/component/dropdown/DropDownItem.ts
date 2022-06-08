/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de DropDownItem
 * @type:			Service
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('DropDownItem', DropDownItem);

		DropDownItem.$inject = ['Logger'];
		
		function DropDownItem ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('DropDownItem');
			$log.debug('ON.-');

			class DropDownItem {

				label : string;
				icon : string;
				status : boolean;
				action : Function;
				changeFunction : Function;
				color : string;
				itemReference : object;
				statusAttribute : string;
				labelAttribute : string;
				/**
				 *
				 */
				constructor(data) {
					this.label = data.label;						// String value
					this.icon = data.icon;							// String value
					this.status = data.status;						// Bool
					this.action = data.action;						// Function
					this.changeFunction = data.changeFunction;		// Function
					this.color = data.color;						// String value
					
					this.itemReference = data.itemReference;		// Object
					this.statusAttribute = data.statusAttribute;	// String
					this.labelAttribute = data.labelAttribute;		// String
				}

				public static build (data) : DropDownItem {
					// agregar alguna validacion de creación
					// data.active = (angular.isUndefined(data.active)) ? true : data.active;
	
					if (data.itemReference) {
						if (data.statusAttribute)
							data.status = data.itemReference[data.statusAttribute];	
	
						if (data.labelAttribute) 
						data.label = data.itemReference[data.labelAttribute];
	
					} else {
						data.status = (angular.isUndefined(data.status)) ? true : data.status;
						data.label = data.label;
					}
	
					return new DropDownItem(data);
				}
	
				public isReference() : boolean {
					return (this.itemReference) ? true : false;
				}
	
				public updateStatus() {
					if (this.isReference()) {
						this.status = this.itemReference[this.statusAttribute];
					}
				}
	
				public changeStatus() {
					if (this.isReference()) {
						this.itemReference[this.statusAttribute] = this.status;
					}
	
					if (this.changeFunction && angular.isFunction(this.changeFunction)) {
						this.changeFunction.call(this);
					}
				}
	
				public isCheckeable() :boolean {
					if (!angular.isUndefined(this.statusAttribute)) {
						return true;
					}
					if (!angular.isUndefined(this.status)) {
						return true;
					}
					return false;
				}
	
				public isValid() : boolean {
					// if (angular.isUndefined(this.statusAttribute) && angular.isUndefined(this.route)) {
					// 	$log.error('Debe existir el atributo activo (statusAttribute) o una ruta (route).',this);
					// 	return false;
					// }
					return true;
				}
			}
			return DropDownItem;
		}
	};

	return module;
})();