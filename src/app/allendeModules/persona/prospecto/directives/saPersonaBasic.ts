/**
 * @author 			emansilla
 * @description 	description
 */
import saPersonaBasicView = require('./saPersonaBasic.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saPersonaBasic', saPersonaBasic);

		saPersonaBasic.$inject = ['ButtonService', 'SupportDataService'];
		function saPersonaBasic (ButtonService, SupportDataService) {

			return {
				restrict : 'E',
				scope : {
					model : '=',
					title : '@?',
					btnSearchClick : '&?',
					btnSearchDisabled : '=?',
					btnSearchIf : '=?',
					btnSearchClass : '=?',

					btnEditClick: '&?',
					btnEditDisabled: '=?',
					btnEditIf: '=?',
					btnEditClass: '=?',
				},
				template: saPersonaBasicView,
				link : link
			};

			function link (scope, element, attrs) {
				scope.sinDatos = 'Sin datos';
				ButtonService.validarButtons(scope);

				function buscarPatologias(newValue) {
					
					if (newValue) {

						SupportDataService.obtenerActivosDelPacienteParaAletaAdministrativa(scope.model.id_paciente)
						.then(function (patologias) {
							
							scope.patologias = patologias;
						});
					}
				}


				scope.$watch(function () {
					return scope.model;
				}, buscarPatologias, true);

			}
			
		}
	}

	return module;

})();