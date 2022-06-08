/**
 * @author:			Pedro Ferrer
 * @description:	DomicilioMutual
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('DomicilioMutualEditController', DomicilioMutualEditController);

		DomicilioMutualEditController.$inject = ['Logger', '$scope'];

		function DomicilioMutualEditController ($log, $scope) {

			$log = $log.getInstance('DomicilioMutualEditController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;

			vm.data = {
				domicilios : [],
				id : null
			};

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			function activate () { 
				vm.data.domicilios = $scope.$parent.vm.data.mutual.Domicilios;
				vm.data.id = $scope.$parent.vm.data.id;
			}
		}
	};

	return module;
})();