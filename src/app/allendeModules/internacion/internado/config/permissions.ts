/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PERMISSION_INTERNADO', {
			LIST_ALL: 67,
			LIST_PARTOS: 68,
			LEVANTAR_ALTA: 138,
			EDIT: 17,
			EDIT_ALTA: 70,
			EDIT_ADMITIDO: 71,
			ANULAR: 214,
			REVERT: 215
		});

	};
	
	return module;

})();