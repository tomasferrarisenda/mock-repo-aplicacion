export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.constant('TABS_FARMACIA',
			{
				REPOSICION: {
					NAME: "REPOSICION",
					TITLE_TAB: "REPOSICION",
					TITLE_CONTENT: "Reposicion de stock al piso",
					CONTENT: "farmacia/views/tabs/stock-tab-reposicion.html",
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
					TITLE_CONTENT: "Listado de movimientos de stock al piso",
					CONTENT: "farmacia/views/tabs/stock-tab-listado-farmacia.html",
					DISABLED: false,
					ACTIVE: false,
					CLASS: "protesis",
					CLASSBG: "protesis-bg",
					aria: "home",
					hide: false,
					order: 2
				},
				AJUSTE: {
					NAME: "AJUSTE",
					TITLE_TAB: "AJUSTE",
					TITLE_CONTENT: "Ajuste stock normal del piso",
					CONTENT: "farmacia/views/tabs/stock-tab-ajuste.html",
					DISABLED: false,
					ACTIVE: false,
					CLASS: "admision",
					CLASSBG: "admision-bg",
					aria: "home",
					hide: false,
					order: 3
				},
				VALIDACION: {
					NAME: "VALIDACION",
					TITLE_TAB: "VALIDACION",
					TITLE_CONTENT: "Validacion de medicacion",
					CONTENT: "farmacia/views/tabs/stock-tab-validacion.html",
					DISABLED: false,
					ACTIVE: false,
					CLASS: "prescripcion",
					CLASSBG: "prescripcion-bg",
					aria: "home",
					hide: false,
					order: 4
				},
				FACTURACION: {
					NAME: "FACTURACION",
					TITLE_TAB: "FACTURACION",
					TITLE_CONTENT: "Facturacion de Farmacia",
					CONTENT: "farmacia/views/tabs/stock-tab-facturacion.html",
					DISABLED: false,
					ACTIVE: false,
					CLASS: "datos",
					CLASSBG: "datos-bg",
					aria: "home",
					hide: false,
					order: 5
				},
				INFORME: {
					NAME: "INFORME",
					TITLE_TAB: "INFORME",
					TITLE_CONTENT: "Informe para gerencia",
					CONTENT: "farmacia/views/tabs/stock-tab-informe.html",
					DISABLED: false,
					ACTIVE: false,
					CLASS: "esterilizacion",
					CLASSBG: "esterilizacion-bg",
					aria: "home",
					hide: false,
					order: 6
				},
				QUIROFANO: {
					NAME: "QUIROFANO",
					TITLE_TAB: "QUIROFANO",
					TITLE_CONTENT: "Entrega de Quirofano",
					CONTENT: "farmacia/views/tabs/stock-tab-quirofano.html",
					DISABLED: false,
					ACTIVE: false,
					CLASS: "datos",
					CLASSBG: "datos-bg",
					aria: "home",
					hide: false,
					order: 8
				},
				REPO_QUIROFANO: {
					NAME: "REPO_QUIROFANO",
					TITLE_TAB: "QUIROFANO",
					TITLE_CONTENT: "Reposicion de Quirofano",
					CONTENT: "farmacia/views/tabs/stock-tab-repo-quirofano.html",
					DISABLED: false,
					ACTIVE: false,
					CLASS: "datos",
					CLASSBG: "datos-bg",
					aria: "home",
					hide: false,
					order: 7
				},
			});

	};

	return module;
})();