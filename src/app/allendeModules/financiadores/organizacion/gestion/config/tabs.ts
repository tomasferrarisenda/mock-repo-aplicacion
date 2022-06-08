export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {
		module.constant('ORGANIZACION_TABS', [
			{
				"Id": 1,
				"IdsPermisosPadres" : [207],
				"STATE" : "financiadores.organizacion.edit.general",
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
				"IdsPermisosPadres" : [207],
				"STATE" : "financiadores.organizacion.edit.domicilio",
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
				"Id": 3,
				"IdsPermisosPadres" : [207],
				"STATE" : "financiadores.organizacion.edit.telefono",
				"NAME": "TELEFONO",
				"TITLE_TAB": "TELEFONO",
				"DISABLED": false,
				"CLASS": "color-tab-4",
				"CLASSBG": "tab-rosa-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			}
		]);
	};
	return module;
})();