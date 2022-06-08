/**
 * @author:			Ezequiel Mansilla
 * @description:	Consattnes para manejo de excepciones
 * @type:			Constant
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.constant('ERROR_LEVEL', {
			ERROR : 1,
			WARNING : 2
		});
		
	};
	return module;
})();