/**
 * @author:			Ezequiel Mansilla
 * @description:	Solapas para preadmision
 * @type:			Constant
 */
import tabPreadmisionTemplate = require('../../admision/views/tabs/admision-tab-preadmision.html');
import tabAdmisionTemplate = require('../../admision/views/tabs/admision-tab-admision.html');
import tabGaranteTemplate = require('../../admision/views/tabs/admision-tab-garante.html');
import tabEmpresaTemplate = require('../../admision/views/tabs/admision-tab-empresa.html');
import tabCamaTemplate = require('../../admision/views/tabs/admision-tab-cama.html');
import tabAutorizacionTemplate = require('../views/tabs/internado-tab-autorizacion.html');
import tabObservacionesTemplate = require('../views/tabs/internado-tab-observaciones.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('INTERNADO_TABS', [
			{
				"Id": 9,
				"IdsPermisosPadres" : [70,71],
				"IdSistema": 18,
				"NAME": "PREADMISION",
				"TITLE_TAB": "PREADMISIÓN",
				"TITLE_CONTENT": "DATOS DE PREADMISION",
				"CONTENT": tabPreadmisionTemplate,
				"DISABLED": false,
				"ACTIVE": true,
				"CLASS": "datos",
				"CLASSBG": "datos-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 10,
				"IdsPermisosPadres" : [70,71],
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
				"Id": 11,
				"IdsPermisosPadres" : [70,71],
				"IdSistema": 18,
				"NAME": "GARANTE",
				"TITLE_TAB": "GARANTE",
				"TITLE_CONTENT": "DATOS DEL GARANTE",
				"CONTENT": tabGaranteTemplate,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "prescripcion",
				"CLASSBG": "prescripcion-bg",
				"ARIA": "settings",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 12,
				"IdsPermisosPadres" : [70,71],
				"IdSistema": 18,
				"NAME": "EMPRESA",
				"TITLE_TAB": "EMPRESA",
				"TITLE_CONTENT": "DATOS DE EMPRESA A FACTURAR",
				"CONTENT": tabEmpresaTemplate,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "admision",
				"CLASSBG": "admision-bg",
				"ARIA": "home",
				"HIDE": true,
				"Sistema": null
			},
			{
				"Id": 13,
				"IdsPermisosPadres" : [70,71],
				"IdSistema": 18,
				"NAME": "CAMA",
				"TITLE_TAB": "CAMA",
				"TITLE_CONTENT": "MOVIMIENTO DE CAMAS",
				"CONTENT": tabCamaTemplate,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "protesis",
				"CLASSBG": "protesis-bg",
				"ARIA": "profile",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 32,
				"IdsPermisosPadres" : [70,71],
				"IdSistema": 18,
				"NAME": "AUTORIZACION",
				"TITLE_TAB": "AUTORIZACIÓN",
				"TITLE_CONTENT": "AUTORIZACIONES",
				"CONTENT": tabAutorizacionTemplate,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "banco",
				"CLASSBG": "banco-bg",
				"ARIA": "messages",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 33,
				"IdsPermisosPadres" : [70,71],
				"IdSistema": 18,
				"NAME": "OBSERVACIONES",
				"TITLE_TAB": "OBSERVACIONES",
				"TITLE_CONTENT": "OBSERVACIONES",
				"CONTENT": tabObservacionesTemplate,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "esterilizacion",
				"CLASSBG": "esterilizacion-bg",
				"ARIA": "settings",
				"HIDE": false,
				"Sistema": null
			}
		]);
		
	};
	return module;

})();