/**
 * @author:			Jorge Basiluk
 * @description:	Domicilio Sociedad
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('DomicilioSociedadEditController', DomicilioSociedadEditController);

		DomicilioSociedadEditController.$inject = ['Logger', '$scope'];

		function DomicilioSociedadEditController ($log, $scope) {

			$log = $log.getInstance('DomicilioSociedadEditController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;

			vm.data = {
				domicilios : [],
				id : null
			};

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			function activate () { 
				vm.data.domicilios = $scope.$parent.vm.data.sociedadEdit.Domicilios;
				vm.data.id = $scope.$parent.vm.data.sociedadEdit.Id;
			}
		}
	};

	return module;
})();