export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.constant('TABS_ENFERMERIA',
			{
				ASIGNACION: {
					NAME: "ASIGNACION",
					TITLE_TAB: "ASIGNACION",
					TITLE_CONTENT: "Asignacion de stock a paciente",
					CONTENT: "enfermeria/views/tabs/stock-tab-asignacion.html",
					DISABLED: false,
					ACTIVE: true,
					CLASS: "datos",
					CLASSBG: "datos-bg",
					aria: "home",
					hide: false,
					order: 1
				},
				LISTADO: {
					NAME: "LISTADO",
					TITLE_TAB: "LISTADO",
					TITLE_CONTENT: "Listado de movimientos de stock",
					CONTENT: "enfermeria/views/tabs/stock-tab-listado-enfermeria.html",
					DISABLED: false,
					ACTIVE: false,
					CLASS: "protesis",
					CLASSBG: "protesis-bg",
					aria: "home",
					hide: false,
					order: 2
				}
			});

	};

	return module;
})();
