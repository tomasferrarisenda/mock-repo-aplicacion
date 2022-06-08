/**
 * @author:			Jorge Basiluk
 * @description:	Telefono Sociedad
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('TelefonoSociedadEditController', TelefonoSociedadEditController);

		TelefonoSociedadEditController.$inject = ['Logger', '$scope'];

		function TelefonoSociedadEditController ($log, $scope) {

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;
			vm.data = {
				telefonos : [],
				id : null
			};

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			function activate () {
				vm.data.telefonos = $scope.$parent.vm.data.sociedadEdit.Telefonos;
				vm.data.id = $scope.$parent.vm.data.sociedadEdit.Id;
			}
		}
	};

	return module;
})();