/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('TITLE_PROFESIONAL', {
			MODULE: 'PROFESIONAL',
			VIEW: 'TITULO PARA VER'
		});
		
	};

	return module;

})();