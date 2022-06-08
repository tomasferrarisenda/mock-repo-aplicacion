/**
 * @author 			emansilla
 * @description 	description
 */
import mutualTemplate = require('../templates/sa-mutual.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saMutual', saMutual);

		saMutual.$inject = [];
		function saMutual () {

			return {
				restrict : 'E',
				scope : {
					model : '=',
					required : '=?',
					title : '@?',
					btnSearch : '=?',
					btnSearchDisabled : '=?'
				},
				template: mutualTemplate,
				controller : MutualController
			};
		}

		MutualController.$inject = ['$scope', 'MutualLogicService'];
		function MutualController($scope, MutualLogicService) {
			// body...
			$scope.loading = false;
			$scope.openSelector = openMutualSelector;

			function openMutualSelector () {
				$scope.loading = true;
				MutualLogicService.openMutualOldSelector()
				.then(successCallback, errorCallback);

				function successCallback (pMutual) {
					$scope.loading = false;
					$scope.model = pMutual;
				}

				function errorCallback (pError) {
					$scope.loading = false;
					// $scope.model = null;
				}
			}

			// activate();
			// function activate () {

			// }
		}
	};

	return module;

})();