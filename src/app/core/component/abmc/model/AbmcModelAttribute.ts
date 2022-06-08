/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de AbmcModelAttribute
 * @type:			Service
 **/
import * as angular from 'angular';
 
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('AbmcModelAttribute', AbmcModelAttribute);

		AbmcModelAttribute.$inject = ['Logger'];
		
		function AbmcModelAttribute ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('AbmcModelAttribute');
			$log.debug('ON.-');

			class AbmcModelAttribute{
				label : string;
				type : string;
				required : boolean;
				field : string;

				private possibleDataTypes : Array<string> = ['number', 'text', 'date', 'boolean', 'combo'];

				constructor (data) {
					this.label = data.label;				// [Text] Etiqueta de elemento
					this.type = data.type;					// [Text] Tipo de dato que maneja. Importante para render y formato
					this.required = data.required;			// [Bool] Si es requerido o no
					this.field = data.field;				// [Text] Nombre de campo de elemento
				}

				public static build (data : any) : AbmcModelAttribute {
					// Si no viene definido label, le seteo el valor del field (campo)
					data.label = (angular.isUndefined(data.label)) ? data.field : data.label;
					// Si no viene definido el tipo se setea en text
					data.type = (angular.isUndefined(data.type)) ? "text" : data.type;
					// Si no viene definido si es requerido se setea en false
					data.required = (angular.isUndefined(data.required)) ? false : data.required;
					return new AbmcModelAttribute(data);
				}
	
				public isValid() {
					return true;
				}
	
				private checkDataType(pType) {
					return this.possibleDataTypes.indexOf(pType) !== -1;
				}
			}

			return AbmcModelAttribute;
		}
	};

	return module;
})();