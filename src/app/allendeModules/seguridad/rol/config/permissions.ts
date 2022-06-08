/**
 * @author:			ppautasso
 * @description:	Permisos para abm de usuarios
 * @type:			Constant
 */
export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.constant('PERMISSION_ROL', {
			LIST: 127,
			NEW: 128,
			DELETE: 134,
			EDIT: 135,

		});

	};
	return module;
})();
