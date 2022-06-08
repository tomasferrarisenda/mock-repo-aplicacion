/**
 * @author:			Jorge Basiluk
 * @description:	Domicilio Profesional
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('DomicilioProfesionalEditController', DomicilioProfesionalEditController);

		DomicilioProfesionalEditController.$inject = ['Logger', '$scope'];

		function DomicilioProfesionalEditController ($log, $scope) {

			//$log = $log.getInstance('DomicilioProfesionalEditController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;

			vm.data = {
				domicilios : [],
				id : null
			};

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			function activate () { 
				vm.data.domicilios = $scope.$parent.vm.data.profesionalEdit.Domicilios;
				vm.data.id = $scope.$parent.vm.data.profesionalEdit.Id;
			}
		}
	};

	return module;
})();