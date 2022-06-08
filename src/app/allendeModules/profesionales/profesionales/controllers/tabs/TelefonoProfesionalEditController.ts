/**
 * @author:			Jorge Basiluk
 * @description:	Telefono Profesional
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('TelefonoProfesionalEditController', TelefonoProfesionalEditController);

		TelefonoProfesionalEditController.$inject = ['Logger', '$scope'];

		function TelefonoProfesionalEditController ($log, $scope) {

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;
			vm.data = {
				telefonos : [],
				id : null
			};

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			function activate () {
				vm.data.telefonos = $scope.$parent.vm.data.profesionalEdit.Telefonos;
				vm.data.id = $scope.$parent.vm.data.profesionalEdit.Id;
			}
		}
	};

	return module;
})();