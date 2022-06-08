/**
 * @author 			emansilla
 * @description 	description
 */
import prequirurgicosTemplate = require('../templates/sa-prequirurgicos-internacion.tpl.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saPrequirurgicosInternacion', saPrequirurgicosInternacion);

		saPrequirurgicosInternacion.$inject = ['$log', 'PreadmisionLogicService'];
		function saPrequirurgicosInternacion ($log, PreadmisionLogicService) {
			return {
				restrict : 'E',
				require: '^form',
				scope : {
					model : '=',
					title : '@?',

					required : '=?',
					btnDisabled : '=?'
				},
				template: prequirurgicosTemplate,
				link: link
			};

			function link ($scope) {
				
				$scope.sinDatos = 'Sin datos';
				$scope.loading = false;
				$scope.tieneValor = '';
				$scope.btnClick = openPrequirurgicos;

				function openPrequirurgicos	() {
					$scope.loading = true;
					PreadmisionLogicService.openPrequirurgicos($scope.model)
					.then(successCallback, errorCallback);

					function successCallback (pPrequirurgicos) {
						$scope.tieneValor = 'Todo ok';
						$scope.loading = false;
						$scope.model = pPrequirurgicos;
					}

					function errorCallback () {
						if ($scope.model.length)
							$scope.tieneValor = 'Todo ok';
						$scope.loading = false;
					}
				}

				activate();
				function activate () {
					setTimeout(function (){
						// $log.debug('saPrequirurgicosInternacion: activate ON.-', $scope.model);
						if ($scope.model.length)
							$scope.tieneValor = 'Todo ok';

					}, 1500);
				}
			}
		}
	};

	return module;

})();