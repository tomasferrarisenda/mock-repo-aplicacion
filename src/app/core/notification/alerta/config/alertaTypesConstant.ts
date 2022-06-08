/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.constant('MODAL_TYPE', {
			CONFIRM : {
				id_type_modal : 1,
				name_type_modal : 'CONFIRM',
				title_type_modal : 'Confirmar',
				btn_cancel : true,
				prompt : false,
				class_header : 'color-confirm',
				class_button : 'btn-default',
				icon_type_modal : 'glyphicon glyphicon-question-sign'
			},
			WARNING : {
				id_type_modal : 2,
				name_type_modal : 'WARNING',
				title_type_modal : 'Aviso',
				btn_cancel : false,
				prompt : false,
				class_header : 'color-warning',
				class_button : 'btn-warning',
				icon_type_modal : 'glyphicon glyphicon-warning-sign'
			},
			ERROR : {
				id_type_modal : 3,
				name_type_modal : 'ERROR',
				title_type_modal : 'Error',
				btn_cancel : false,
				prompt : false,
				class_header : 'color-danger',
				class_button : 'btn-danger',
				icon_type_modal : 'glyphicon glyphicon-remove-sign'
			},
			INFO : {
				id_type_modal : 4,
				name_type_modal : 'INFO',
				title_type_modal : 'Información',
				btn_cancel : false,
				prompt : false,
				class_header : 'color-info',
				class_button : 'btn-info',
				icon_type_modal : 'glyphicon glyphicon-info-sign'
			},
			SUCCESS : {
				id_type_modal : 5,
				name_type_modal : 'SUCCESS',
				title_type_modal : 'Correcto',
				btn_cancel : false,
				prompt : false,
				class_header : 'color-success',
				class_button : 'btn-success',
				icon_type_modal : 'glyphicon glyphicon-ok-sign'
			},
			SELECT : {
				id_type_modal : 6,
				name_type_modal : 'SELECT',
				title_type_modal : 'Seleccionar',
				btn_cancel : true,
				prompt : false,
				class_header : 'color-default',
				class_button : 'btn-default',
				icon_type_modal : 'glyphicon glyphicon-plus-sign'
			},
			PROMPT : {
				id_type_modal : 7,
				name_type_modal : 'PROMPT',
				title_type_modal : null,
				btn_cancel : true,
				prompt : true,
				class_header : 'color-default',
				class_button : 'btn-default',
				icon_type_modal : 'glyphicon glyphicon-plus-sign'
			},
			DIALOG : {
				id_type_modal : 8,
				name_type_modal : 'DIALOG',
				title_type_modal : 'Título perzonalizado',
				btn_cancel : true,
				prompt : false,
				class_header : 'color-default',
				class_button : 'btn-default',
				icon_type_modal : 'glyphicon glyphicon-question-sign'
			}
		});

		ngModule.constant('TIPOS_ALERTA',{
			'toaster-id': 1,

			'icon-classes': {
            	SistemasCritica: 	'toast-common alertaCritica toast-Sistemas',
            	SistemasAlta: 	'toast-common alertaAlta toast-Sistemas',
            	SistemasMedia: 	'toast-common alertaMedia toast-Sistemas',
            	SistemasBaja: 	'toast-common alertaBaja toast-Sistemas',
            	FacturacionCritica: 	'toast-common alertaCritica toast-Facturacion',
			}
		});
	};

	return module;
})();
