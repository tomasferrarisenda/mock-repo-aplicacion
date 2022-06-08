/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de Filtering
 * @type:			Service
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('Filtering', Filtering);

		Filtering.$inject = ['Logger'];
		
		function Filtering ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('Filtering');
			// $log.debug('ON.-');

			class Filtering {
				label : string;
				filters : Array<any> = [];
				status : string;
				changeFunction : Function;

				constructor(data) {
					this.label = data.label;					// Label de filtro
					this.filters = data.filters;				// Lista de filtros
					this.status = data.status;					// Estado de los filtros
					this.changeFunction = data.changeFunction;	// Funcion de cambio
				}

				public static build (data) : Filtering {
					data.filters = angular.isUndefined(data.filters) ? [] : data.filters;
					data.label = angular.isUndefined(data.label) ? 'Mostrar filtros' : data.label;
					data.status = angular.isUndefined(data.status) ? false : data.status;
					return new Filtering(data);
				}
	
				public addFilter(pFilter) {
					var insert = true;
					for (var i = 0; i < this.filters.length; i++) {
						// Si existe en la lista, lo actualizo solo si es valido
						if (this.filters[i].equals(pFilter)) {
							insert = false;
	
							if (pFilter.isValid()) {
								this.filters[i] = angular.copy(pFilter);
							} else {
								this.filters.splice(i, 1);
							}
							break;
						}
					}
					// Si no existe lo agrego
					if (insert && pFilter.isValid()) this.filters.push(pFilter);
				}
	
				public getFilters() : any {
					return this.filters.map(function (filter) {
						return {
							key : filter.column.field,
							value : filter.value
						};
					});
				}
	
				public getFilterObject() : any {
					var _filters = this.getFilters();
	
					var filterObject = {
					};
	
					if (_filters && _filters.length) {
						for (var i = 0; i < _filters.length; i++) {
							filterObject[_filters[i].key] = _filters[i].value;
						}
					}
					return { data : filterObject};
				}
	
				public isValid() : boolean {
					if (!this.filters || !this.filters.length) return false;
					return true;
				}
			}
			return Filtering;
		}
	};

	return module;
})();