/**
 * @author:			Pedro Ferrer
 * @description:	Solapas para prefactura ambulatorio
 * @type:			Constant
 */
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PREFACTURA_AMBULATORIO_TABS', [
			{
				"Id": 1,
				"IdsPermisosPadres" : [90],
				"IdSistema": 18,
				"STATE" : "prefacturacion.ambulatorio.new.turno",
				"NAME": "PREFACTURAPACIENTE",
				"TITLE_TAB": "CARGA PREFACTURA",
				"DISABLED": false,
				"CLASS": "datos",
				"CLASSBG": "datos-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 2,
				"IdsPermisosPadres" : [90],
				"IdSistema": 18,
				"STATE" : "prefacturacion.ambulatorio.new.practica",
				"NAME": "ITEM",
				"TITLE_TAB": "CARGA ITEM",
				"DISABLED": false,
				"CLASS": "datos",
				"CLASSBG": "datos-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			}
		]);
	};
	return module;
})();