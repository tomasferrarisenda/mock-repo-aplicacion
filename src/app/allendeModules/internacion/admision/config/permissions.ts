/**
 * @author:			Ezequiel Mansilla
 * @description:	Permisos para preadmision
 * @type:			Constant
 */
export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_ADMISION', {
			NEW: 10,
			LIST: 11,
		});
		
	};
	return module;

})();