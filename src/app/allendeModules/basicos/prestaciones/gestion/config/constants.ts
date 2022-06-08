/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('ACTION_PRESTACION_GESTION', {
			INIT : '/Prestacion/Gestion',

			NEW : '/Prestacion/Gestion/New',
			LIST : '/Prestacion/Gestion/List',
			LIST_ALL : '/Prestacion/Gestion/List/All',
	
			DELETE : '/Prestacion/Gestion/Delete',
			EDIT : '/Prestacion/Gestion/Edit'
		});



		module.constant('PERMISSION_PRESTACION', {
			NEW: 'New',
			LIST: 'List',
			DELETE: 'Delete',
			EDIT: 'Edit'
		});

	};

	return module;

})();