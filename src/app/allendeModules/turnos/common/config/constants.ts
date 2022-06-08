export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('TITLE_SUBSISTEMATURNO_COMMON', {
			MODULE : 'TURNO', 
			HOME : 'Home',
			ABOUT : 'Acerca de ',
			VIEW : 'Titulo'
		});

		module.constant('ACTION_SUBSISTEMATURNO_COMMON', {
			INIT : '/Turno',
			DEFAULT : '/Turno/Home',
			HOME : '/Turno/Home',
			ABOUT : '/Turno/About',
			VIEW : '/Turno/View'
		});

	};

	return module;
})();
