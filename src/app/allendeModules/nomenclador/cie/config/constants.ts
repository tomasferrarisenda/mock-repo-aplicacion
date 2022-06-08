/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('ACTION_NOMENCLADOR_CIE', {
			INIT : '/Nomenclador/Cie',
			DEFAULT : '/Nomenclador/Cie/List',
			LIST : '/Nomenclador/Cie/List',
			VIEW : '/Nomenclador/Cie/View'
		});
	};

	return module;
})();