/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {
		module.constant('TIPO_NOMENCLADOR', {
			NOMENCLADOR_NACIONAL : 1,
			NBU : 2,
			NO_NOMENCLADO : 3
		});
	};

	return module;

})();