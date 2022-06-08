/**
 * @author:			Ezequiel Mansilla
 * @description:	Combo para tipo documentos
 * @type:			Directive
 **/
import * as angular from 'angular';

import tipoDocumentoTemplate = require("./sa-tipo-documento-combo-old.tpl.html");
import { ISupportDataService } from '../../../allendeModules/support/basic/services';

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saTipoDocumentoOldCombo', saTipoDocumentoOldCombo);

		saTipoDocumentoOldCombo.$inject = ['$log', 'SupportDataService'];
		function saTipoDocumentoOldCombo ($log, SupportDataService: ISupportDataService) {
			return {
				restrict : 'E',
				require: '?ngModel',
				scope : {
					title : '@?',
					loading : '=?',
					ngDisabled : '=?'
				},
				template : tipoDocumentoTemplate,
				link: function (scope, element, attrs, controller) {
					
					if (!controller) return;

					scope.required = (attrs.ngRequired || attrs.required) ? true : false;
					scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
					scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;
					scope.opcionVacia = (scope.required) ? '--SELECCIONAR--' : 'TODOS';
					scope.tiposDocumentos = [];
					scope.tipoDocumentoChanged = updateModel;

					function updateModel (pTipoDoc) {
						controller.$setViewValue(pTipoDoc);
					}

					scope.$watch('loading', function(newValue) {
						updateDirective(newValue);
					});

					scope.$watch(function () {
						return controller.$modelValue;
					}, function(newValue) {
						updateDirective(newValue);
					});

					function updateDirective (pValue) {
						if (!pValue)
							scope.tipoDocSelect = controller.$modelValue || controller.$viewValue || '';
					}

					activate();

					function activate() {
						SupportDataService.getAllTiposDocumento()
						.then(getAllTiposDocumentoOk);
						
						function getAllTiposDocumentoOk (pTiposDocumentos) {
							scope.tiposDocumentos = pTiposDocumentos;
							updateDirective(false);
						}
					}
				}
			};
		}
	};

	return module;
})();