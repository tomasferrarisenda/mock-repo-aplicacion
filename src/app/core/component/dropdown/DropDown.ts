/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de DropDown
 * @type:			Service
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('DropDown', DropDown);

		DropDown.$inject = ['Logger'];
		
		function DropDown ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('DropDown');
			$log.debug('ON.-');

			class DropDown {

				label : string;
				items : string;
				icon : string;
				btnClass : string;
				btnContainerClass : string;
				required: boolean;
				// autoClose: boolean;

				constructor (data) {
					this.label = data.label;
					this.items = data.items;
					this.icon = data.icon;
					this.btnClass = data.btnClass;
					this.btnContainerClass = data.btnContainerClass;
					this.required = data.required;
					// this.autoClose = data.autoClose;
				}

				public static build (data) :DropDown {
					// agregar alguna validacion de creación
					return new DropDown(data);
				}
	
				public isValid() : boolean {
					if (!this.label && !this.icon) {
						$log.error('Debe ingresar label o icon');
						return false;
					}
					return true;
				}
			}

			return DropDown;
		}
	};

	return module;

})();