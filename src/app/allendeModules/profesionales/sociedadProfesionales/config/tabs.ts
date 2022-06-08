export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('SOCIEDADES_TABS', [
			{
				"Id": 1,
				"IdsPermisosPadres" : [228],
				"STATE" : "profesionales.sociedadProfesionales.edit.general",
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
				"STATE" : "profesionales.sociedadProfesionales.edit.domicilio",
				"NAME": "DOMICILIOS",
				"TITLE_TAB": "DOMICILIOS",
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
				"STATE" : "profesionales.sociedadProfesionales.edit.telefono",
				"NAME": "TELEFONOS",
				"TITLE_TAB": "TELEFONOS",
				"DISABLED": false,
				"CLASS": "color-tab-3",
				"CLASSBG": "tab-violeta-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 4,
				"IdsPermisosPadres" : [228],
				"STATE" : "profesionales.sociedadProfesionales.edit.distribuciones",
				"NAME": "DISTRIBUCIONES",
				"TITLE_TAB": "DISTRIBUCIONES",
				"DISABLED": false,
				"CLASS": "color-tab-4",
				"CLASSBG": "tab-rosa-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 5,
				"IdsPermisosPadres" : [228],
				"STATE" : "profesionales.sociedadProfesionales.edit.documentos",
				"NAME": "DOCUMENTOS",
				"TITLE_TAB": "DOCUMENTOS",
				"DISABLED": false,
				"CLASS": "color-tab-5",
				"CLASSBG": "tab-verde-claro-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			}
		]);
	};
	return module;
})();