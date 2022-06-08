/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('ACTION_ROLES', {
			INIT : '/Roles/Gestion',

			NEW : '/Roles/Gestion/New',
			LIST : '/Roles/Gestion/List',
			LIST_ALL : '/Roles/Gestion/List/All',
	
			DELETE : '/Roles/Gestion/Delete',
			EDIT : '/Roles/Gestion/Edit'
		});



		// module.constant('PERMISSION_PRESTACION', {
		// 	NEW: 'New',
		// 	LIST: 'List',
		// 	DELETE: 'Delete',
		// 	EDIT: 'Edit'
		// });

	};

	return module;
})();
