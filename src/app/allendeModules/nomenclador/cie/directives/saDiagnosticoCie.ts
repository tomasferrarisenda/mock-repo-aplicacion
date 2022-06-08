/**
 * @author 			emansilla
 * @description 	description
 */
import diagnosticoTemplate = require('../templates/sa-diagnostico-cie.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saDiagnosticoCie', saDiagnosticoCie);

		saDiagnosticoCie.$inject = [];
		function saDiagnosticoCie () {

			return {
				restrict : 'E',
				scope : {
					model : '=',
					required : '=?',
					title : '@?',
					btnSearch : '=?',
					btnSearchDisabled : '=?'
				},
				template: diagnosticoTemplate,
				controller : DiagnosticoCieController
			};
		}

		DiagnosticoCieController.$inject = ['$scope', 'CieLogicService']
		function DiagnosticoCieController ($scope, CieLogicService) {
			$scope.loading = false;
			$scope.openSelector = openDiagnosticoSelector;


			function openDiagnosticoSelector () {
				$scope.loading = true;
				CieLogicService.openSelector()
				.then(successCallback, errorCallback);

				function successCallback (pDiagnostico) {
					$scope.loading = false;
					$scope.model = pDiagnostico;
				}

				function errorCallback (pError) {
					$scope.loading = false;
					$scope.model = null;
				}
			}

			// activate();
			// function activate () {

			// }
		}
	}

	return module;
})();