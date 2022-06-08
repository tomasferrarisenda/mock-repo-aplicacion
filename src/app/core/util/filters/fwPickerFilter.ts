/**
 * @author:			Ezequiel Mansilla
 * @description:	Selector dinámico de filtro por nombre
 * @type:			Filter
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// UTILIDADES: [FILTER] Selector dinámico de filtro por nombre
		ngModule.filter('fwPicker', fwPicker);

		fwPicker.$inject = ['$filter'];
		function fwPicker($filter) {
			return function(value, filterName, args) {

				if (!filterName) return value;

				var valueReturn;

				switch (filterName) {

					case 'date': 		return $filter('date')(value, 'dd/MM/yyyy');
					case 'datetime': 	return $filter('date')(value, 'dd/MM/yyyy HH:mm');
					case 'time': 		return $filter('date')(value, 'HH:mm');
					case 'capitalize': 	return $filter('saCapitalize')(value, true);
					case 'decimal': 	return $filter('number')(value, args || 2);
					case 'integer': 	return $filter('number')(value, 0);
					case 'longtext': 	return value;
					case 'boolean':
							if (value === true) return 'SI';
							if (value === false) return 'NO';
							return '';
				}

				valueReturn = $filter(filterName)(value);

				return valueReturn;
			};
		}
		
	};
	return module;
})();