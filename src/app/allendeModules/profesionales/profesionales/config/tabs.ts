export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PROFESIONALES_TABS', [
			{
				"Id": 1,
				"IdsPermisosPadres" : [228],
				"STATE" : "profesionales.profesionales.edit.general",
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
				"STATE" : "profesionales.profesionales.edit.domicilio",
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
				"STATE" : "profesionales.profesionales.edit.telefono",
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
				"STATE" : "profesionales.profesionales.edit.nacionalidad",
				"NAME": "NACIONALIDADES",
				"TITLE_TAB": "NACIONALIDADES",
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
				"STATE" : "profesionales.profesionales.edit.seguros",
				"NAME": "SEGUROS",
				"TITLE_TAB": "SEGUROS",
				"DISABLED": false,
				"CLASS": "color-tab-5",
				"CLASSBG": "tab-verde-claro-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
            },
            {
				"Id": 6,
				"IdsPermisosPadres" : [228],
				"STATE" : "profesionales.profesionales.edit.distribuciones",
				"NAME": "DISTRIBUCIONES",
				"TITLE_TAB": "DISTRIBUCIONES",
				"DISABLED": false,
				"CLASS": "color-tab-6",
				"CLASSBG": "tab-celeste-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 7,
				"IdsPermisosPadres" : [228],
				"STATE" : "profesionales.profesionales.edit.documentos",
				"NAME": "DOCUMENTOS",
				"TITLE_TAB": "DOCUMENTOS",
				"DISABLED": false,
				"CLASS": "color-tab-7",
				"CLASSBG": "tab-c-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			}
			,
			{
				"Id": 8,
				"IdsPermisosPadres" : [228],
				"STATE" : "profesionales.profesionales.edit.facturar",
				"NAME": "FACTURAR",
				"TITLE_TAB": "FACTURAR A",
				"DISABLED": false,
				"CLASS": "color-tab-8",
				"CLASSBG": "tab-dark-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			}
		]);
	};
	return module;
})();