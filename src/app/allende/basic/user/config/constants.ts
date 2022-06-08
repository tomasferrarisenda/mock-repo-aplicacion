/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };
	
	module.init = function (ngModule) {
		ngModule.constant('TITLE_USER', {
			VIEW: 'Mis Datos',
			MODULE: 'USUARIO'
		});
	};
	return module;
})();