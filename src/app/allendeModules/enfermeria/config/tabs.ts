export const ENFERMERIA_HOME_TABS = [
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
		"CLASS": "color-tab-2",
		"CLASSBG": "tab-naranja-bg",
		"ARIA": "home",
		"HIDE": false,
		"Sistema": null
	}
];


export const ENFERMERIA_INDICACIONESMEDICAS_TABS = [
	{
		"Id": 1,
		"COMPONENT": '<sa-enfermeria-listado-indicaciones-medicas-tab><sa-enfermeria-listado-indicaciones-medicas-tab/>',
		"NAME": "INDICACIONES",
		"TITLE_TAB": "INDICACIONES MEDICAS",
		"DISABLED": false,
		"CLASS": "color-tab-6",
		"CLASSBG": "tab-celeste-bg",
		"ARIA": "home",
		"HIDE": false,
		"Sistema": null
	},
	{
		"Id": 2,
		"COMPONENT": '<sa-farmacia-devoluciones-indicaciones-medicas facturar="true" texto-btn-facturar="Devolver" enfermeria="true"></sa-farmacia-devoluciones-indicaciones-medicas>',
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
		"COMPONENT": '<sa-farmacia-listado-indicaciones-medicas impresion-zebra-if="false" ><sa-farmacia-listado-indicaciones-medicas/>',
		"NAME": "LISTADO DE MOVIMIENTOS",
		"TITLE_TAB": "LISTADO MOVIMIENTOS",
		"DISABLED": false,
		"CLASS": "protesis",
		"CLASSBG": "protesis-bg",
		"ARIA": "home",
		"HIDE": false,
		"Sistema": null
	},
];