/**
 * @author:			Ezequiel Mansilla
 * @description:	Ruta por defecto
 * @type:			Constant
 */
import * as angular from 'angular';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.constant('ROUTER_DEFAULT', 'homesistemas');		
	};
	return module;
})();