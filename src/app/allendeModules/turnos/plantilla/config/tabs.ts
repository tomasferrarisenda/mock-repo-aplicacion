export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.constant('REGLAS_TABS', [
			{
				"Id": 1,
				// "IdsPermisosPadres": [155],
				"COMPONENT": '<sa-loading></sa-loading>',
				// "STATE": "turno.plantilla.duracionturno",
				"NAME": "DURACION TURNOS",
				"TITLE_TAB": "REGLA DURACION TURNOS",
				"DISABLED": false,
				"CLASS": "color-tab-1",
				"CLASSBG": "tab-verde-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 2,
				// "IdsPermisosPadres": [155],
				"COMPONENT": '<sa-loading></sa-loading>',
				// "STATE": "turno.plantilla.reglasdecantidades",
				"NAME": "REGLA DE TURNOS",
				"TITLE_TAB": "REGLA DE TURNOS",
				"DISABLED": false,
				"CLASS": "color-tab-2",
				"CLASSBG": "tab-naranja-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 3,
				// "IdsPermisosPadres": [155],
				"COMPONENT": '<sa-loading></sa-loading>',
				// "STATE": "turno.plantilla.reglasdecantidades",
				"NAME": "REGLA De SOBRETURNOS",
				"TITLE_TAB": "REGLA DE SOBRETURNOS",
				"DISABLED": false,
				"CLASS": "color-tab-3",
				"CLASSBG": "tab-violeta-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			}
		]);
	};
	return module;
})();