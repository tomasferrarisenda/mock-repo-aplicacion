/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de Sorting
 * @type:			Service
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('Sorting', Sorting);

		Sorting.$inject = ['Logger'];
		
		function Sorting ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('Sorting');
			// $log.debug('ON.-');

			class Sorting {
				cols : Array<any> = [];
				type : string;

				static possibleTypes = ['interno', 'externo'];

				constructor(data) {
					this.cols = data.cols; // Lista de columnas
					this.type = data.type; // Tipo de sorting				
				}

				public static build (data) : Sorting {
	
					if (!data.cols || !data.cols.length) data.cols = [];
					// agregar alguna validacion de creación
					return new Sorting(data);
				}
	
				/**
				* Private function
				*/
				static checkTypes(pType) : boolean {
					return Sorting.possibleTypes.indexOf(pType) !== -1;
				}
	
				public addCol(pCol) {
					if (!pCol) {
						$log.error('La columna es requerida para agregarla');
						return;
					}
	
					var exist = false;
					for (var i = this.cols.length - 1; i >= 0; i--) {
						if (this.cols[i].equals(pCol)) {
							// Si existe y ya no es ordenable lo quito
							if (!pCol.isSorted()) this.cols.splice(i, 1);
							// Si no, no hago nada ya que por referencia se actualiza
							exist = true;
							break;
						}
					}
					// Si no existe en la lista, lo agrego
					if (!exist) this.cols.push(pCol);
				}
	
				public getFieldsOrderBy() {
					return this.cols.map(function (col) {
						return col.getOrderFieldName();
					});
				}
	
				public isInterna() : boolean {
					return this.type === 'interno';
				}
	
				public isValid() : boolean {
					if (!Sorting.checkTypes(this.type)) {
						$log.warn('El atributo tipo (type) no corresponde a ninguno elegible', this, Sorting.possibleTypes);
						return false;
					}
	
					if (!this.cols || !this.cols.length) return false;
					return true;
				}
			}

			return Sorting;
		}
	};

	return module;
})();