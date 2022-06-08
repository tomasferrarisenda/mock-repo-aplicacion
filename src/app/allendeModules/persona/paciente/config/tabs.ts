/**
 * @author:			Hernán Castro
 * @description:	Solapas para persona
 * @type:			Constant
 */
import pacienteGeneralTabTemplate = require('../views/tabs/paciente-tab-general.html');
import pacienteDomicilioTabTemplate = require('../views/tabs/paciente-tab-domicilios.html');
import pacienteMutualesTabTemplate = require('../views/tabs/paciente-tab-mutuales.html');
import pacienteTelefonosTabTemplates = require('../views/tabs/paciente-tab-telefonos.html');
import pacienteResponsablesTabTemplates = require('../views/tabs/paciente-tab-responsables.html');
import pacienteNacionalidadesTabTemplates = require('../views/tabs/paciente-tab-nacionalidades.html');
import pacienteACargoTabTemplates = require('../views/tabs/paciente-tab-paciente-a-cargo.html');

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PACIENTE_TABS', [
			{
			"Id": 15,
			"IdsPermisosPadres" : [196,101],
			"IdSistema": 34,
			"NAME": "GENERAL",
			"TITLE_TAB": "GENERAL",
			"TITLE_CONTENT": "DATOS DEL PACIENTE",
			"CONTENT": pacienteGeneralTabTemplate,
			"DISABLED": false,
			"ACTIVE": true,
			"CLASS": "datos",
			"CLASSBG": "datos-bg",
			"ARIA": "home",
			"HIDE": false,
			"Sistema": null
		}, {
			"Id": 18,
			"IdsPermisosPadres" : [196,101],
			"IdSistema": 34,
			"NAME": "TELEFONOS",
			"TITLE_TAB": "TELEFONOS",
			"TITLE_CONTENT": "TELEFONOS",
			"CONTENT": pacienteTelefonosTabTemplates,
			"DISABLED": false,
			"ACTIVE": false,
			"CLASS": "admision",
			"CLASSBG": "admision-bg",
			"ARIA": "home",
			"HIDE": false,
			"Sistema": null
		}, {
			"Id": 17,
			"IdsPermisosPadres" : [196,101],
			"IdSistema": 34,
			"NAME": "MUTUALES",
			"TITLE_TAB": "MUTUALES",
			"TITLE_CONTENT": "MUTUALES",
			"CONTENT": pacienteMutualesTabTemplate,
			"DISABLED": false,
			"ACTIVE": false,
			"CLASS": "prescripcion",
			"CLASSBG": "prescripcion-bg",
			"ARIA": "settings",
			"HIDE": false,
			"Sistema": null
		}, {
			"Id": 16,
			"IdsPermisosPadres" : [196,101],
			"IdSistema": 34,
			"NAME": "DOMICILIOS",
			"TITLE_TAB": "DOMICILIOS",
			"TITLE_CONTENT": "DOMICILIOS",
			"CONTENT": pacienteDomicilioTabTemplate,
			"DISABLED": false,
			"ACTIVE": false,
			"CLASS": "informe",
			"CLASSBG": "informe-bg",
			"ARIA": "settings",
			"HIDE": false,
			"Sistema": null
		}, {
			"Id": 19,
			"IdsPermisosPadres" : [196,101],
			"IdSistema": 34,
			"NAME": "RESPONSABLES",
			"TITLE_TAB": "RESPONSABLES",
			"TITLE_CONTENT": "RESPONSABLES",
			"CONTENT": pacienteResponsablesTabTemplates,
			"DISABLED": false,
			"ACTIVE": false,
			"CLASS": "protesis",
			"CLASSBG": "protesis-bg",
			"ARIA": "profile",
			"HIDE": false,
			"Sistema": null
		}, {
			"Id": 20,
			"IdsPermisosPadres" : [196,101],
			"IdSistema": 34,
			"NAME": "PACIENTESACARGO",
			"TITLE_TAB": "PACIENTES A CARGO",
			"TITLE_CONTENT": "PACIENTES A CARGO",
			"CONTENT": pacienteACargoTabTemplates,
			"DISABLED": false,
			"ACTIVE": false,
			"CLASS": "protesis",
			"CLASSBG": "protesis-bg",
			"ARIA": "profile",
			"HIDE": false,
			"Sistema": null
		}, {
			"Id": 21,
			"IdsPermisosPadres" : [196,101],
			"IdSistema": 34,
			"NAME": "NACIONALIDADES",
			"TITLE_TAB": "NACIONALIDADES",
			"TITLE_CONTENT": "NACIONALIDADES",
			"CONTENT": pacienteNacionalidadesTabTemplates,
			"DISABLED": false,
			"ACTIVE": false,
			"CLASS": "cirugia",
			"CLASSBG": "cirugia-bg",
			"ARIA": "profile",
			"HIDE": false,
			"Sistema": null
		}
		]);
		
	};
	return module;

})();