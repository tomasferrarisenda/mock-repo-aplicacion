export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('CONVENIO_TABS', [
			{
				"Id": 1,
				"IdsPermisosPadres" : [155],
				"STATE" : "financiadores.convenios.edit.normativa",
				"NAME": "NORMATIVAS",
				"TITLE_TAB": "NORMATIVAS",
				"DISABLED": false,
				"CLASS": "color-tab-1",
				"CLASSBG": "tab-verde-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 2,
				"IdsPermisosPadres" : [155],
				"STATE" : "financiadores.convenios.edit.clausula",
				"NAME": "CLAUSULAS",
				"TITLE_TAB": "CLAUSULAS",
				"DISABLED": false,
				"CLASS": "color-tab-2",
				"CLASSBG": "tab-naranja-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 3,
				"IdsPermisosPadres" : [155],
				"STATE" : "financiadores.convenios.edit.unidadArancelaria",
				"NAME": "UNIDADESARANCELARIAS",
				"TITLE_TAB": "UNIDADES ARANCELARIAS",
				"DISABLED": false,
				"CLASS": "color-tab-3",
				"CLASSBG": "tab-violeta-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 4,
				"IdsPermisosPadres" : [155],
				"STATE" : "financiadores.convenios.edit.listaPrecio",
				"NAME": "LISTASDEPRECIOS",
				"TITLE_TAB": "LISTAS DE PRECIOS",
				"DISABLED": false,
				"CLASS": "color-tab-4",
				"CLASSBG": "tab-rosa-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 5,
				"IdsPermisosPadres" : [155],
				"STATE" : "financiadores.convenios.edit.ADAC",
				"NAME": "ADAC",
				"TITLE_TAB": "ADAC",
				"DISABLED": false,
				"CLASS": "color-tab-5",
				"CLASSBG": "tab-verde-claro-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 6,
				"IdsPermisosPadres" : [155],
				"STATE" : "financiadores.convenios.edit.Documentos",
				"NAME": "DOCUMENTOS",
				"TITLE_TAB": "DOCUMENTOS",
				"DISABLED": false,
				"CLASS": "color-tab-6",
				"CLASSBG": "tab-celeste-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			}
		]);
	};
	return module;
})();