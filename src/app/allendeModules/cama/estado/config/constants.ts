/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('ACTION_CAMA', {
			INIT : '/Cama',
			DEFAULT : 'Cama/List',
			NEW : '/Cama/New',
			LIST : '/Cama/List',
			LIST_ALL : '/Cama/List/All',
			LIST_LIMPIEZA : '/Cama/List/Limpieza',
			LIST_MANTENIMIENTO : '/Cama/List/Mantenimiento',
			DELETE : '/Cama/Delete',
			EDIT : '/Cama/Edit'
		});

		module.constant('PERMISSION_CAMA', {
			NEW: 'New',
			LIST: 'List',
			DELETE: 'Delete',
			EDIT: 'Edit'
		});

	};

	return module;

})();