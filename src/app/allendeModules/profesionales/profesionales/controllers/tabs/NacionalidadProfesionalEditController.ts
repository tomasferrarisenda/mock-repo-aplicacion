/**
 * @author:			Jorge Basiluk
 * @description:	Nacionalidad Profesional
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('NacionalidadProfesionalEditController', NacionalidadProfesionalEditController);

		NacionalidadProfesionalEditController.$inject = ['Logger', '$scope'];

		function NacionalidadProfesionalEditController ($log, $scope) {

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;
			vm.data = {
				nacionalidades : [],
				id : null
			};

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			function activate () {
				vm.data.nacionalidades = $scope.$parent.vm.data.profesionalEdit.Nacionalidades;
				vm.data.id = $scope.$parent.vm.data.profesionalEdit.Id;
			}
		}
	};

	return module;
})();