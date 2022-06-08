/**
 * @author:			Pedro Ferrer
 * @description:	PlanMutual
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PlanMutualEditController', PlanMutualEditController);

		PlanMutualEditController.$inject = ['Logger', '$scope'];

		function PlanMutualEditController ($log, $scope) {

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;

			vm.data = {
				planes : [],
				idMutual : null
			};
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.data.planes = $scope.$parent.vm.data.mutual.Planes;
				vm.data.idMutual = $scope.$parent.vm.data.mutual.Id;
			}
		}
	};

	return module;
})();