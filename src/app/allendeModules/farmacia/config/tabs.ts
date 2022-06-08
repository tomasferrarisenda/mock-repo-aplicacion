export const FARMACIA_HOME_TABS = [
	{
		"Id": 1,
		"COMPONENT": '<sa-enfermeria-asignacion></sa-enfermeria-asignacion>',
		"NAME": "STOCK",
		"TITLE_TAB": "STOCK",
		"DISABLED": false,
		"CLASS": "color-tab-1",
		"CLASSBG": "tab-verde-bg",
		"ARIA": "home",
		"HIDE": false,
		"Sistema": null
	},
	{
		"Id": 2,
		"COMPONENT": '<sa-enfermeria-listado-movimientos-stock></sa-enfermeria-listado-movimientos-stock>',
		"NAME": "LISTADO MOVIMIENTOS ",
		"TITLE_TAB": "LISTADO MOVIMIENTOS ",
		"DISABLED": false,
		"CLASS": "protesis",
		"CLASSBG": "protesis-bg",
		"ARIA": "home",
		"HIDE": false,
		"Sistema": null
	},
	{
		"Id": 3,
		"COMPONENT": '<sa-farmacia-configuracion-stock></sa-farmacia-configuracion-stock>',
		"NAME": "CONFIGURACION",
		"TITLE_TAB": "CONFIGURACION",
		"DISABLED": false,
		"CLASS": "admision",
		"CLASSBG": "admision-bg",
		"ARIA": "home",
		"HIDE": false,
		"Sistema": null
	}
];

export const FARMACIA_INDICACIONESMEDICAS_TABS = [
	{
		"Id": 1,
		"COMPONENT": '<sa-farmacia-validacion-indicaciones-medicas></sa-farmacia-validacion-indicaciones-medicas>',
		"NAME": "VALIDACION",
		"TITLE_TAB": "VALIDACION",
		"DISABLED": false,
		"CLASS": "color-tab-1",
		"CLASSBG": "tab-verde-bg",
		"ARIA": "home",
		"HIDE": false,
		"Sistema": null
	},
	{
		"Id": 2,
		"COMPONENT": '<sa-farmacia-devoluciones-indicaciones-medicas facturar="true" texto-btn-facturar="Facturar/Devolver" enfermeria="false"></sa-farmacia-devoluciones-indicaciones-medicas>',
		"NAME": "PENDIENTES ",
		"TITLE_TAB": "PENDIENTES ",
		"DISABLED": false,
		"CLASS": "admision",
		"CLASSBG": "admision-bg",
		"ARIA": "home",
		"HIDE": false,
		"Sistema": null
	},
	{
		"Id": 3,
		"COMPONENT": '<sa-farmacia-listado-indicaciones-medicas impresion-zebra-if="true"><sa-farmacia-listado-indicaciones-medicas/>',
		"NAME": "LISTADO DE MOVIMIENTOS",
		"TITLE_TAB": "LISTADO MOVIMIENTOS",
		"DISABLED": false,
		"CLASS": "protesis",
		"CLASSBG": "protesis-bg",
		"ARIA": "home",
		"HIDE": false,
		"Sistema": null
	},
	{
		"Id": 4,
		"COMPONENT": '<sa-farmacia-listado-indicaciones-tab><sa-farmacia-listado-indicaciones-tab/>',
		"NAME": "INDICACIONES",
		"TITLE_TAB": "INDICACIONES",
		"DISABLED": false,
		"CLASS": "color-tab-6",
		"CLASSBG": "tab-celeste-bg",
		"ARIA": "home",
		"HIDE": false,
		"Sistema": null
	}
];