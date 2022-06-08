/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de ColumnBase
 * @type:			Service
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('ColumnBase', ColumnBase);

		ColumnBase.$inject = ['Logger'];
		
		function ColumnBase ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('ColumnBase');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			function ColumnBase (data) {
				this.label = data.label;			// Nombre que figura en la cabecera de la columna
				this.classCol = data.classCol;	// Texto que corresponde a una clase ("text-center", "text-right", ..)
				this.type = data.type;			// Tipo de campo ("number", "text", "date")
				this.order = data.order;			// Número de orden en que aparecen las columnas
				this.visible = data.visible;		// Si la columna es visible o no
			}

			var possibleTypes = ['number', 'text', 'date', 'function'];

			ColumnBase.prototype.isValid = isValid;
			ColumnBase.prototype.isVisible = isVisible;

			return ColumnBase;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/**
			* Private function
			*/
			function checkType(pType) {
				return possibleTypes.indexOf(pType) !== -1;
			}

			/**
			 * Dice si la columna es visible o no
			 * @return {Boolean}
			 */
			function isVisible() {
				return this.visible;
			}

			function isValid() {
				var col = this;
				// Valido type
				if (angular.isUndefined(col.type)) {
					$log.error('El atributo "type" es requerido.',col);
					return false;
				}

				if (!checkType(col.type)) {
					$log.warn('El atributo tipo (type) no corresponde a ninguno elegible', col, possibleTypes);
					return false;
				}
				return true;
			}
		}
	};

	return module;
})();