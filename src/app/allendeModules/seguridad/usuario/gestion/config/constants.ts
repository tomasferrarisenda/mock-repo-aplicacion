/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('ACTION_USUARIO', {
			INIT : '/Usuario/Gestion',

			NEW : '/Usuario/Gestion/New',
			LIST : '/Usuario/Gestion/List',
			LIST_ALL : '/Usuario/Gestion/List/All',
	
			DELETE : '/Usuario/Gestion/Delete',
			EDIT : '/Usuario/Gestion/Edit'
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

