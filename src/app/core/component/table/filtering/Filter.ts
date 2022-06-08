/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de Filter
 * @type:			Service
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('Filter', Filter);

		Filter.$inject = ['Logger'];
		
		function Filter ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('Filter');
			// $log.debug('ON.-');

			class Filter {
				column : any;
				value : string;
				type : string;

				constructor(data) {
					this.column = data.column;		// [Column] Columna a filtrar
					this.value = data.value;		// [String] Valor de filtro a aplicar
					this.type = data.type;			// [String] Tipo de filtro: START_WITH, CONTAINS, END_WITH, EQUAL
				}

				public static build (data) : Filter {
					
					data.type = (angular.isUndefined(data.type)) ? 'CONTAINS' : data.type;
					
					return new Filter(data);
				}
	
				public equals(pFilter) : boolean {
					return pFilter.column.field === this.column.field;
				}
	
				public isValid() : boolean {
					if (!this.column) return false;
	
					if (!this.value) return false;
					
					return true;
				}
			}

			return Filter;
		}
	};

	return module;
})();