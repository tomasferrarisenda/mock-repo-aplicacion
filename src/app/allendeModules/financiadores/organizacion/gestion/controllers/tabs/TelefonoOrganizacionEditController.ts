/**
 * @author:			Pedro Ferrer
 * @description:	TelefonoOrganizacion
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('TelefonoOrganizacionEditController', TelefonoOrganizacionEditController);

		TelefonoOrganizacionEditController.$inject = ['Logger', '$scope'];

		function TelefonoOrganizacionEditController ($log, $scope) {

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;
			vm.data = {
				telefonos : [],
				id : null
			};

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			function activate () {
				vm.data.telefonos = $scope.$parent.vm.data.organizacion.Telefonos;
				vm.data.id = $scope.$parent.vm.data.id;
			}
		}
	};

	return module;
})();