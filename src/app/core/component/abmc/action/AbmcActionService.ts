/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de AbmcActionService
 * @type:			Service
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('AbmcActionService', AbmcActionService);

		AbmcActionService.$inject = ['Logger'];
		
		function AbmcActionService ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('AbmcActionService');
			$log.debug('ON.-');

			class AbmcActionService {
				
				dataService : Function;			// [Text] Nombre del data service
				actions : Array<any> = [];			// [Array] Lista de acciones de Abmc
				/**
				 *
				 */
				constructor(data) {
					this.dataService = data.dataService;
					this.actions = data.actions;
				}
				
				public isValid() {
					return true;
				}
	
				public callFunction(pMethod, pParameter) {
					if(this.dataService.hasOwnProperty(pMethod)) {
						return this.dataService[pMethod].call(this,pParameter);
					} else {
						$log.error('callFunction::no existe el metodo',pMethod);
					}
				}
	
				public hasBase() {
					var tiene = false;
					if (this.actions && this.actions.length) {
						for (var i = 0; i < this.actions.length; i++) {
							if (this.actions[i].isBase()) {
								if (tiene) $log.error('Tiene mas de una accion base. Va a devolver la primera');
								tiene = true;
							}
						}
					}
	
					return tiene;
				}
	
				public getBaseAction() {
					if (this.actions && this.actions.length) {
	
						if (this.hasBase()) {
							for (var i = 0; i < this.actions.length; i++) {
								if (this.actions[i].isBase()) {
									return this.actions[i];
								}
							}
						}
					}
				}
	
				public static build(data) {
					// agregar alguna validacion de creación
					return new AbmcActionService(data);
				}
			}
			return AbmcActionService;
		}
	};

	return module;
})();