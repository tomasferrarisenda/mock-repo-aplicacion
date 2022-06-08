/**
 * @author:			Pedro Ferrer
 * @description:	TelefonoMutual
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('TelefonoMutualEditController', TelefonoMutualEditController);

		TelefonoMutualEditController.$inject = ['Logger', '$scope'];

		function TelefonoMutualEditController ($log, $scope) {

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;
			vm.data = {
				telefonos : [],
				id : null
			};

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			function activate () {
				vm.data.telefonos = $scope.$parent.vm.data.mutual.Telefonos;
				vm.data.id = $scope.$parent.vm.data.id;
			}
		}
	};

	return module;
})();