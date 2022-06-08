/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de Button
 * @type:			Service
 **/
import * as angular from 'angular';
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('Button', Button);

		Button.$inject = ['Logger'];
		
		function Button ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('Button');
			// $log.debug('ON.-');

			class Button {
				action: Function;
				icon: string;
				label: string;
				type: string;
				visible: boolean;
				visibleIf: Function;
				idElement: string;

				private possibleTypes : Array<string> = ['context', 'column', 'full'];

				constructor(data) {
					this.action = data.action;				// Funcion que realiza el botón
					this.icon = data.icon;					// Nombre del icono del botón que corresponde a fw-icon.
					this.label = data.label;				// Nombre textual del boton para tooltip o label.
					this.visible = data.visible;			// Valor si es visible o no
					this.visibleIf = data.visibleIf;		// Funcion para validar si es visible o no
					this.type = data.type;					// Tipo de botón (contextual o de columna, o full)
					this.idElement = data.idElement;		// Id del btn para referencial
				}

				public static build (data) {
					// agregar alguna validacion de creación
					data.visible = (angular.isUndefined(data.visible)) ? true : data.visible;
					data.visibleIf = angular.isUndefined(data.visibleIf) ? null : data.visibleIf;
					data.type = angular.isUndefined(data.type) ? 'full' : data.type;
					return new Button(data);
				}
	
				/**
				 * Retorna si el botón es visible en base a una fila y el contexto
				 * @param dataRow Row en table
				 * @param type Uno de los possibleTypes
				 */
				public isVisible(dataRow, type) {
					var visible = false;
					// Primero valido si es visible según lógica de fila y condición de botón
					if (this.visible && this.visibleIf && angular.isFunction(this.visibleIf)) {
						if (dataRow) visible = this.visibleIf({ row: dataRow });
					} else {
						visible = this.visible;
					}
					// Segundo valido si corresponde ser visible según el tipo 
					if (type) {
						// Si son del mismo tipo retorno el valor visible
						if (type === this.type || this.type === "full") return visible;
					}
					return visible;
				}

				/**
				* Private function
				*/
				private checkType(pType) {
					return this.possibleTypes.indexOf(pType) !== -1;
				}
				
				public isValid() : boolean {
					if (!this.icon) {
						$log.error('El atributo icono (icon) es requerido');
						return false;
					}
	
					if (!this.action) {
						$log.error('El atributo accion (action) es requerido');
						return false;
					}
	
					if (!angular.isFunction(this.action)) {
						$log.warn('El atributo accion (action) debe ser una función.');
						return false;
					} 

					// Valido type
					if (angular.isUndefined(this.type)) {
						console.error('El atributo "type" es requerido.',this);
						return false;
					}

					if (!this.checkType(this.type)) {
						console.warn('El atributo tipo (type) no corresponde a ninguno elegible', this, this.possibleTypes);
						return false;
					}
	
					return true;
				}
			}

			return Button;
		}
	};

	return module;
})();