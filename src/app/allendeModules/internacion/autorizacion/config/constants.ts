/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('ACTION_INTERNADO_AUTORIZACION', {
			// INIT : '/Internado',
			// DEFAULT : '/Internado/List',
			ADD : '/Internado/Autorizacion/Add',
			EDIT : '/Internado/Autorizacion/Edit',
			EDIT_GESTION : '/Internado/Autorizacion/Edit/Gestion',
			EDIT_AUTORIZADO : '/Internado/Autorizacion/Edit/Autorizado',
			VIEW : '/Internado/Autorizacion/View'
		});
	};
	
	return module;

})();