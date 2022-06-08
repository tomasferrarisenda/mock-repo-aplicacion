/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {


		module.constant('TABS_SERVICIOS', [
			 {
				ID : 39,
				NAME: "PRESTACIONES",
				TITLE_TAB: "PRESTACIONES",
				TITLE_CONTENT: "Prestaciones médicas",
				CONTENT: "basicos/servicios/gestion/views/tabs/tab-prestacion-medica.tpl.html",
				DISABLED: false,
				ACTIVE: true,
				CLASS: "datos",
				CLASSBG: "datos-bg",
				aria: "home",
				hide: false,
				order: 1
			},
			 {
				ID : 40,
				NAME: "RECURSOS",
				TITLE_TAB: "RECURSOS",
				TITLE_CONTENT: "Recursos",
				CONTENT: "basicos/servicios/gestion/views/tabs/tab-recursos.tpl.html",
				DISABLED: false,
				ACTIVE: false,
				CLASS: "prescripcion",
				CLASSBG: "prescripcion-bg",
				aria: "home",
				hide: false,
				order: 2
			},
			 {
				ID : 41,
				NAME: "ESPECIALIDADES",
				TITLE_TAB: "ESPECIALIDADES",
				TITLE_CONTENT: "Especialidades médicas",
				CONTENT: "basicos/servicios/gestion/views/tabs/tab-especialidades-medicas.tpl.html",
				DISABLED: false,
				ACTIVE: false,
				CLASS: "banco",
				CLASSBG: "banco-bg",
				aria: "home",
				hide: false,
				order: 3
			}
		]);

	};

	return module;

})();