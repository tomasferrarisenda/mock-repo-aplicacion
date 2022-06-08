export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('MUTUAL_TABS', [
			{
				"Id": 1,
				"IdsPermisosPadres" : [206],
				"STATE" : "financiadores.mutual.edit.general",
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
				"IdsPermisosPadres" : [206],
				"STATE" : "financiadores.mutual.edit.plan",
				"NAME": "PLANES",
				"TITLE_TAB": "PLANES",
				"DISABLED": false,
				"CLASS": "color-tab-2",
				"CLASSBG": "tab-naranja-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 3,
				"IdsPermisosPadres" : [206],
				"STATE" : "financiadores.mutual.edit.domicilio",
				"NAME": "DOMICILIO",
				"TITLE_TAB": "DOMICILIO",
				"DISABLED": false,
				"CLASS": "color-tab-3",
				"CLASSBG": "tab-violeta-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 4,
				"IdsPermisosPadres" : [206],
				"STATE" : "financiadores.mutual.edit.telefono",
				"NAME": "TELEFONO",
				"TITLE_TAB": "TELEFONO",
				"DISABLED": false,
				"CLASS": "color-tab-4",
				"CLASSBG": "tab-rosa-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 5,
				"IdsPermisosPadres" : [206],
				"STATE" : "financiadores.mutual.edit.listaFacturacion",
				"NAME": "LISTAS",
				"TITLE_TAB": "LISTAS",
				"DISABLED": false,
				"CLASS": "color-tab-5",
				"CLASSBG": "tab-verde-claro-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 6,
				"IdsPermisosPadres" : [206],
				"STATE" : "financiadores.mutual.edit.documento",
				"NAME": "DOCUMENTOS",
				"TITLE_TAB": "DOCUMENTOS",
				"DISABLED": false,
				"CLASS": "color-tab-6",
				"CLASSBG": "tab-celeste-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 7,
				"IdsPermisosPadres" : [206],
				"STATE" : "financiadores.mutual.edit.reglas",
				"NAME": "REGLAS",
				"TITLE_TAB": "REGLAS NRO AFILIADO",
				"DISABLED": false,
				"CLASS": "color-tab-7",
				"CLASSBG": "tab-rojo-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			}
		]);
	};
	return module;
})();