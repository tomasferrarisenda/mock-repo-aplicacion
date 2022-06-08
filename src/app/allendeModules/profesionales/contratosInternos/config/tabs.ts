export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('CONTRATOS_INTERNOS_TABS', [
			{
				"Id": 1,
				"IdsPermisosPadres" : [229],
				"STATE" : "profesionales.contratosInternos.edit.general",
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
				"IdsPermisosPadres" : [229],
				"STATE" : "profesionales.contratosInternos.edit.ajuste",
				"NAME": "AJUSTE",
				"TITLE_TAB": "CONCEPTO DE AJUSTE",
				"DISABLED": false,
				"CLASS": "color-tab-2",
				"CLASSBG": "tab-naranja-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 3,
				"IdsPermisosPadres" : [229],
				"STATE" : "profesionales.contratosInternos.edit.pagos",
				"NAME": "PAGOS",
				"TITLE_TAB": "PAGOS",
				"DISABLED": false,
				"CLASS": "color-tab-3",
				"CLASSBG": "tab-violeta-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 4,
				"IdsPermisosPadres" : [229],
				"STATE" : "profesionales.contratosInternos.edit.retencion",
				"NAME": "RETENCIONES",
				"TITLE_TAB": "RETENCIONES",
				"DISABLED": false,
				"CLASS": "color-tab-4",
				"CLASSBG": "tab-rosa-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 5,
				"IdsPermisosPadres" : [229],
				"STATE" : "profesionales.contratosInternos.edit.cuentas",
				"NAME": "CUENTAS",
				"TITLE_TAB": "CUENTAS POR DEFECTO",
				"DISABLED": false,
				"CLASS": "color-tab-5",
				"CLASSBG": "tab-verde-claro-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 6,
				"IdsPermisosPadres" : [229],
				"STATE" : "profesionales.contratosInternos.edit.participacion",
				"NAME": "PARTICIPACION",
				"TITLE_TAB": "PARTICIPACIONES",
				"DISABLED": false,
				"CLASS": "color-tab-6",
				"CLASSBG": "tab-celeste-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 7,
				"IdsPermisosPadres" : [229],
				"STATE" : "profesionales.contratosInternos.edit.facturaDirecto",
				"NAME": "FACTURA DIRECTO",
				"TITLE_TAB": "FACTURA DIRECTO",
				"DISABLED": false,
				"CLASS": "color-tab-1",
				"CLASSBG": "tab-verde-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 8,
				"IdsPermisosPadres" : [228],
				"STATE" : "profesionales.contratosInternos.edit.documentos",
				"NAME": "DOCUMENTOS",
				"TITLE_TAB": "DOCUMENTOS",
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