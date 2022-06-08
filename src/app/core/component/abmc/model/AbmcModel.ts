/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de AbmcModel
 * @type:			Service
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('AbmcModel', AbmcModel);

		AbmcModel.$inject = ['Logger'];
		
		function AbmcModel ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('AbmcModel');
			$log.debug('ON.-');

			class AbmcModel {
				name : string;					// Nombre del modelo
				attributes : Array<any> = [];		// Lista de atributos

				constructor(data) {
					this.name = data.name;
					this.attributes = data.attributes;
				}

				public static build (data) {
					data.name = (angular.isUndefined(data.name)) ? "Sin nombre" : data.name;
					// agregar alguna validacion de creación
					return new AbmcModel(data);
				}
	
				public addAttribute(pAttribute) {
					this.attributes.push(pAttribute);
				}
	
				public isValid() : boolean{
					return true;
				}
			}

			return AbmcModel;
		}
	};

	return module;

})();