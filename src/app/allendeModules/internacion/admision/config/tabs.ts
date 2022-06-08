/**
 * @author:			Ezequiel Mansilla
 * @description:	Solapas para preadmision
 * @type:			Constant
 */
import tabPreadmisionTempalte = require('../views/tabs/admision-tab-preadmision.html');
import tabAdmisionTemplate = require('../views/tabs/admision-tab-admision.html');
import tabGaranteTempalte = require('../views/tabs/admision-tab-garante.html');
import tabEmpresaTempalte = require('../views/tabs/admision-tab-empresa.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('ADMISION_TABS', [
			{
				"Id": 1,
				"IdsPermisosPadres" : [10],
				"IdSistema": 18,
				"NAME": "PREADMISION",
				"TITLE_TAB": "PREADMISIÓN",
				"TITLE_CONTENT": "DATOS DE PREADMISION",
				"CONTENT": tabPreadmisionTempalte,
				"DISABLED": false,
				"ACTIVE": true,
				"CLASS": "datos",
				"CLASSBG": "datos-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 2,
				"IdsPermisosPadres" : [10],
				"IdSistema": 18,
				"NAME": "ADMISION",
				"TITLE_TAB": "ADMISIÓN",
				"TITLE_CONTENT": "DATOS DE ADMISIÓN",
				"CONTENT": tabAdmisionTemplate,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "informe",
				"CLASSBG": "informe-bg",
				"ARIA": "settings",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 3,
				"IdsPermisosPadres" : [10],
				"IdSistema": 18,
				"NAME": "GARANTE",
				"TITLE_TAB": "GARANTE",
				"TITLE_CONTENT": "DATOS DEL GARANTE",
				"CONTENT": tabGaranteTempalte,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "prescripcion",
				"CLASSBG": "prescripcion-bg",
				"ARIA": "settings",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 4,
				"IdsPermisosPadres" : [10],
				"IdSistema": 18,
				"NAME": "EMPRESA",
				"TITLE_TAB": "EMPRESA",
				"TITLE_CONTENT": "DATOS DE EMPRESA A FACTURAR",
				"CONTENT": tabEmpresaTempalte,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "admision",
				"CLASSBG": "admision-bg",
				"ARIA": "home",
				"HIDE": true,
				"Sistema": null
			}
		]);
		
	};
	return module;

})();