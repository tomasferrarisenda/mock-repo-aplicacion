/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import afiliacionTemplate = require('../templates/sa-afiliacion-internado.tpl.html');
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saAfiliacionInternado', saAfiliacionInternado);

		saAfiliacionInternado.$inject = ['$log', 'SupportDataService'];
		function saAfiliacionInternado ($log, SupportDataService: ISupportDataService) {
			return {
				restrict : 'E',
				scope : {
					title : '@?',
					model : '=',
					print : '=?',
					edit : '=?',
					manual : '=?',
					modulada : '=?'
				},
				template: afiliacionTemplate,
				link: link
			};
			
			function link  (scope, element, attrs) {
				scope.sinDatos = 'Sin datos';
				scope.manual = (angular.isUndefined(attrs.manual)) ? false : scope.manual;
				scope.edit = (angular.isUndefined(attrs.edit)) ? false : scope.edit;
				scope.print = (angular.isUndefined(attrs.print)) ? false : scope.print;
				scope.modulada = (angular.isUndefined(attrs.modulada)) ? false : scope.modulada;
				scope.changeForm = changeForm;

				scope.$watch('model.Mutual', function(newValue, oldValue, scope) {
					if (newValue && oldValue && newValue.id_mutual != oldValue.id_mutual){
					// if ((newValue && newValue.id_mutual) != (oldValue && oldValue.id_mutual)) {
						$log.debug('Cambio mutual de saAfiliacionInternado');
						scope.model.nombre_plan_mutual = '';
						scope.model.TipoAfiliado = null;
						changeForm();
					}
				});

				function changeForm() {
					if (scope.formAfiliacion && scope.formAfiliacion) {
						scope.formAfiliacion.$pristine = false;
						if (scope.formAfiliacion.$$parentForm) {
							scope.formAfiliacion.$$parentForm.$pristine = false;

							if (scope.formAfiliacion.$$parentForm.$$parentForm) {
								scope.formAfiliacion.$$parentForm.$$parentForm.$pristine = false;
							}
						}
					}
				}

				SupportDataService.getAllTipoAfiliadoSinAmbos()
				.then(function (pTiposAfiliado) {
					scope.tiposAfiliado = pTiposAfiliado;
				});
			}
		}
	};

	return module;

})();