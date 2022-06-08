/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de ButtonSet
 * @type:			Service
 **/
import * as angular from 'angular';
import { Column } from '../column/Column';
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('ButtonSet', ButtonSet);

		ButtonSet.$inject = ['Logger', 'Button'];
		
		function ButtonSet ($log, Button) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('ButtonSet');
			// $log.debug('ON.-');
			
			class ButtonSet extends Column{
				buttons : Array<any> = [];

				constructor(data) {
					super(data);
					this.buttons = data.buttons || [];
				}

				public static build (data) : ButtonSet {
					data.label = (angular.isUndefined(data.label)) ? 'Acciones' : data.label;
					// Si no viene definido la visibilidad se setea en false
					data.visible = (angular.isUndefined(data.visible)) ? false : data.visible;
					data.order = (angular.isUndefined(data.order)) ? 999 : data.order;
					data.classCol = (angular.isUndefined(data.classCol)) ? "text-center" : data.classCol;
					data.idElement = (angular.isUndefined(data.idElement)) ? 'element-' : data.idElement;
					// El type siempre es buttons
					data.type = 'buttons';
					return new ButtonSet(data);
				}
	
				public addButton(pButton) {
					var but = Button.build(pButton);
					if (but.isValid()) this.buttons.push(but);

					// Actualizo el valor de visible
					if (this.buttons && this.buttons.length) {
						for (let index = 0; index < this.buttons.length; index++) {
							const element = this.buttons[index];
							if (element.isVisible(undefined, 'column')) {
								this.visible = true;
								break;
							}
						}
					}
				}
	
				public isData() : boolean {
					return false;
				}
	
				public isHtml() : boolean {
					return false;
				}
	
				public isButtonset() : boolean {
					return true;
				}
	
				public isValid() : boolean {
					// var flag = Column.prototype.isValid.call(this);
					// if (!flag) return flag;
	
					if (!this.buttons || !this.buttons.length) {
						$log.error('Debe tener cargado botones', this);
						return false;
					}
	
					return true;
				}
			}

			return ButtonSet;
		}
	};

	return module;
})();