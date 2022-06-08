/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('TITLE_PACIENTE', {
			MODULE : 'PACIENTE',
			VIEW : 'TITULO PARA VER',
			NEW : 'Nuevo Paciente',
			EDIT : 'Editar Paciente Nº ',
			LIST : 'Lista de Pacientes',
			NEW_BABY : 'Nuevo nacimiento',
			PACIENTE_SELECTOR : 'Seleccionar un paciente'
		});

		module.constant('ACTION_PACIENTE', {
			INIT : '/Paciente',
			DEFAULT : '/Paciente/List',
			VIEW : '/Paciente/View',
			NEW : '/Paciente/New',
			LIST : '/Paciente/List',
			EDIT : '/Paciente/Edit'
		});
				
	};

	return module;
})();