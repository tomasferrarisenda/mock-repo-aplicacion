/**
 * @author:			Ezequiel Mansilla
 * @description:	Solapas para preadmision
 * @type:			Constant
 */
import tabPacienteTemplate = require('../views/tabs/preadmision-tab-paciente.html');
import tabInformeTemplate = require('../views/tabs/preadmision-tab-informe.html');
import tabPrescripcionTemplate = require('../views/tabs/preadmision-tab-prescripcion.html');
import tabAdmisionTemplate = require('../views/tabs/preadmision-tab-admision.html');
import tabProtesisTemplate = require('../views/tabs/preadmision-tab-protesis.html');
import tabHuesosTemplate = require('../views/tabs/preadmision-tab-huesos.html');
import tabEsterilizacionTemplate = require('../views/tabs/preadmision-tab-esterilizacion.html');
import tabFarmaciaTemplate = require('../views/tabs/preadmision-tab-farmacia.html');
import tabCirugiaTemplate = require('../views/tabs/preadmision-tab-cirugia.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.constant('PREADMISION_TABS', [
			{
				"Id": 1,
				"IdsPermisosPadres" : [40,41,42,43,47,48,49,50,55,56,58],
				"IdSistema": 18,
				"NAME": "PACIENTE",
				"TITLE_TAB": "PACIENTE",
				"TITLE_CONTENT": "DATOS DEL PACIENTE/AFILIADO",
				"CONTENT": tabPacienteTemplate,
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
				"IdsPermisosPadres" : [40,41,42,43,47,48,49,50,55,56,58],
				"IdSistema": 18,
				"NAME": "INFORME",
				"TITLE_TAB": "INFORME",
				"TITLE_CONTENT": "INFORME MÉDICO Y DIAGNÓSTICO",
				"CONTENT": tabInformeTemplate,
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
				"IdsPermisosPadres" : [40,41,42,43,47],
				"IdSistema": 18,
				"NAME": "PRESCRIPCION",
				"TITLE_TAB": "ELEMENTOS",
				"TITLE_CONTENT": "PRESCRIPCIÓN DE ELEMENTOS SOLICITADOS",
				"CONTENT": tabPrescripcionTemplate,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "prescripcion",
				"CLASSBG": "prescripcion-bg",
				"ARIA": "settings",
				"HIDE": true,
				"Sistema": null
			},
			{
				"Id": 4,
				"IdsPermisosPadres" : [48],
				"IdSistema": 18,
				"NAME": "ADMISION",
				"TITLE_TAB": "AUTORIZACIÓN",
				"TITLE_CONTENT": "AUTORIZACIÓN DE PROCEDIMIENTO",
				"CONTENT": tabAdmisionTemplate,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "admision",
				"CLASSBG": "admision-bg",
				"ARIA": "home",
				"HIDE": false,
				"Sistema": null
			}, 
			{
				"Id": 5,
				"IdsPermisosPadres" : [48,49],
				"IdSistema": 18,
				"NAME": "PROTESIS",
				"TITLE_TAB": "MATERIALES Y PRÓTESIS",
				"TITLE_CONTENT": "INGRESANDO A COTIZACIÓN DE MATERIALES Y PRÓTESIS",
				"CONTENT": tabProtesisTemplate,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "protesis",
				"CLASSBG": "protesis-bg",
				"ARIA": "profile",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 6,
				"IdsPermisosPadres" : [50],
				"IdSistema": 18,
				"NAME": "HUESOS",
				"TITLE_TAB": "BANCO DE HUESOS",
				"TITLE_CONTENT": "INGRESANDO A COTIZACIÓN DE BANCO DE HUESOS",
				"CONTENT": tabHuesosTemplate,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "banco",
				"CLASSBG": "banco-bg",
				"ARIA": "messages",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 7,
				"IdsPermisosPadres" : [55],
				"IdSistema": 18,
				"NAME": "ESTERILIZACION",
				"TITLE_TAB": "ESTERILIZACIÓN",
				"TITLE_CONTENT": "INGRESANDO A ESTERILIZACIÓN",
				"CONTENT": tabEsterilizacionTemplate,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "esterilizacion",
				"CLASSBG": "esterilizacion-bg",
				"ARIA": "settings",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 8,
				"IdsPermisosPadres" : [56],
				"IdSistema": 18,
				"NAME": "FARMACIA",
				"TITLE_TAB": "FARMACIA",
				"TITLE_CONTENT": "INGRESANDO A FARMACIA",
				"CONTENT": tabFarmaciaTemplate,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "prescripcion",
				"CLASSBG": "prescripcion-bg",
				"ARIA": "settings",
				"HIDE": false,
				"Sistema": null
			},
			{
				"Id": 9,
				"IdsPermisosPadres" : [58],
				"IdSistema": 18,
				"NAME": "CIRUGIA",
				"TITLE_TAB": "CIRUGÍA",
				"TITLE_CONTENT": "INGRESANDO A CIRUGÍA",
				"CONTENT": tabCirugiaTemplate,
				"DISABLED": false,
				"ACTIVE": false,
				"CLASS": "cirugia",
				"CLASSBG": "cirugia-bg",
				"ARIA": "messages",
				"HIDE": false,
				"Sistema": null
			}
		]);
		
	};
	return module;

})();