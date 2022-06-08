export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('APARATOS_TABS', [
			{
				"Id": 1,
				"IdsPermisosPadres" : [228],
				"STATE" : "profesionales.aparatos.edit.general",
				"NAME": "GENERAL",
				"TITLE_TAB": "GENERAL",
				"DISABLED": false,
				"CLASS": "color-tab-1",
				"CLASSBG": "tab-verde-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 2,
				"IdsPermisosPadres" : [228],
				"STATE" : "profesionales.aparatos.edit.profesional",
				"NAME": "PROFESIONALES",
				"TITLE_TAB": "PROFESIONALES",
				"DISABLED": false,
				"CLASS": "color-tab-2",
				"CLASSBG": "tab-naranja-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 3,
				"IdsPermisosPadres" : [228],
				"STATE" : "profesionales.aparatos.edit.profesionalAtencion",
				"NAME": "PROFESIONALES ATENCIÓN",
				"TITLE_TAB": "PROFESIONALES ATENCIÓN",
				"DISABLED": false,
				"CLASS": "color-tab-3",
				"CLASSBG": "tab-violeta-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},


		]);
	};
	return module;
})();