/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import tiposDocumentosTemplate = require("../templates/tipos-documento.html");
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saTiposDocumento', saTiposDocumento);

		// saTiposDocumento.$inject = [''];
		function saTiposDocumento () {
			return {
				restrict : 'EA',
				scope : {
					model : '=',
					options : '=',
					changed : '&?',
					error : '=?',
					required : '=',
					disabled : '=?',
					hide : '=?'
				},
				template : tiposDocumentosTemplate,
				link : function (scope, element, attrs) {

					var name = (!angular.isUndefined(attrs.name)) ? attrs.name : '';
					if (name) $('#cmb_tipo_documento').attr("name", name);
					scope.model = {id_tipo_documento:1};
					scope.texto = (scope.required) ?  '--SELECCIONAR--' : 'TODOS';
				}
			};
		}
	};

	return module;
	
})();