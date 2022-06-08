/**
 * @author:			Ezequiel Mansilla
 * @description:	Combo para tipo documentos
 * @type:			Directive
 **/
import * as angular from 'angular';
import tipoDocumentoTemplate = require("./sa-tipo-documento-combo.tpl.html")
import { ISupportDataService } from '../../../allendeModules/support/basic/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// REUTILIZABLE: [DIRECTIVE] Selector combo para tipo de documento nuevo. Se usa con [ng-model]
		ngModule.directive('saTipoDocumentoCombo', saTipoDocumentoCombo);

		saTipoDocumentoCombo.$inject = ['$log', '$timeout', 'SupportDataService'];
		function saTipoDocumentoCombo ($log, $timeout: angular.ITimeoutService, SupportDataService: ISupportDataService) {
			return {
				restrict : 'E',
				require: '?ngModel',
				scope : {
					title : '@?',
					loading : '=?',
					ngDisabled : '=?',
					marginBottom: '<?',
					selectDefault : '<?'
				},
				template : tipoDocumentoTemplate,
				link: function (scope, element, attrs, controller) {
					
					if (!controller) return;

					scope.required = (attrs.ngRequired || attrs.required) ? true : false;
					scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
					scope.marginBottom = (angular.isUndefined(attrs.marginBottom)) ? false : scope.marginBottom;
					scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;
					scope.selectDefault =(angular.isUndefined(attrs.selectDefault)) ? true : scope.selectDefault;
					scope.opcionVacia = (scope.required) ? '--SELECCIONAR--' : 'TODOS';
					scope.tiposDocumentos = [];
					scope.tipoDocumentoChanged = updateModel;

					function updateModel (pTipoDoc) {
						controller.$setViewValue(pTipoDoc);
					}

					scope.$watch(function () {
						return scope.ngDisabled;
					}, updateDisabled);

					scope.$watch(function () {
						return scope.ngRequired;
					}, updateRequired);

					scope.$watch('loading', function(newValue) {
						updateDirective(newValue);
					});

					scope.$watch(function () {
						return controller.$modelValue;
					}, function(newValue) {
						updateDirective(newValue);
					});

					function updateDirective (pValue) {
						if (pValue)
							scope.tipoDocSelect = pValue;
						else 
							scope.tipoDocSelect = controller.$modelValue || controller.$viewValue || '';

					}

					function updateDisabled(value) {
						scope.disabled = value;
					}

					function updateRequired(value) {
						scope.required = value;	
						scope.opcionVacia = (scope.required) ? '--SELECCIONAR--' : 'TODOS';
					}

					function buscarEnDocumentoPorDefecto (pList) {
	 					var index = -1;
						for (var i = 0; i < pList.length; i++) {
							if (pList[i].PorDefecto === true){
								index = i;
								break;
							}
						}
						return index;
					}
					
					$timeout(activate)
					

					function activate() {
						SupportDataService.obtenerTodosTipoDocumento()
						.then(getAllTiposDocumentoOk);
						
						function getAllTiposDocumentoOk (pTiposDocumentos) {
							scope.tiposDocumentos = pTiposDocumentos;
							if(scope.selectDefault && !scope.tipoDocSelect){
								var index = buscarEnDocumentoPorDefecto(pTiposDocumentos);
								if (index === -1) 
									updateDirective(false);
								else {
									updateDirective(scope.tiposDocumentos[index]);
									updateModel(scope.tiposDocumentos[index]);
								}
							}	
						}
					}
				}
			};
		}
	};

	return module;

})();