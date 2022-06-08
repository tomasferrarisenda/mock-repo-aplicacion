/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de AbmcAction
 * @type:			Service
 **/
import * as angular from 'angular';
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('AbmcAction', AbmcAction);

		AbmcAction.$inject = ['Logger'];
		
		function AbmcAction ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('AbmcAction');
			$log.debug('ON.-');

			/* -------------------------------------------- CONSTRUCTOR -------------------------------------------- */

			class AbmcAction {
				title : string;			// [Text] Titulo de pantalla
				label : string;			// [Text] Nombre de etiqueta de botón
				icon : string;				// [Text] Icono de botón
				action : string;			// [Text] Acción a realizar
				// type : string;			// [Text] 
				method : string;			// [Text] Nombre de metodo de dataService.
				mapFunction : Function;// [Function] Función de mapeo de llamada de dataService
				inline : boolean;			// [Bool] Si la accion es por fila o generica (en titulo)
				default : boolean;		// [Bool] Si corresponde a una accion por defecto (list,new,edit..)
				base : boolean;				// [Bool] Si es el punto de ingreso del ABMC

				/**
				 *
				 */
				constructor(data) {
					this.title = data.title;			
					this.label = data.label;			
					this.icon = data.icon;				
					this.action = data.action;			
					// this.type = data.type;
					this.method = data.method;			
					this.mapFunction = data.mapFunction;
					this.inline = data.inline;			
					this.default = data.default;		
					this.base = data.base;				
				}

				public map(pResult) {
					// Si hay una función de mapeo la ejecuto
					if (this.mapFunction && angular.isFunction(this.mapFunction))
						return this.mapFunction.call(this, {result:pResult});
					// Si no, retorno los resultados tal cual
					return pResult;
				}
	
				public isBase() {
					return this.base;
				}
	
				public isValid() {
					return true;
				}

				public static build(data) {
					// Si no viene definido el tipo, le seteo text
					// data.type = (angular.isUndefined(data.type)) ? 'text' : data.type;
					// Si no viene definido el titulo, le seteo alguno generico
					data.title = (angular.isUndefined(data.title)) ? 'Sin título' : data.title;
					return new AbmcAction(data);
				}
			}

			return AbmcAction;
		}
	};

	return module;
})();