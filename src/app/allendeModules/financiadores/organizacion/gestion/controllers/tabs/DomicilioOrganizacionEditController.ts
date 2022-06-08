/**
 * @author:			Pedro Ferrer
 * @description:	DomicilioOrganizacion
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('DomicilioOrganizacionEditController', DomicilioOrganizacionEditController);

		DomicilioOrganizacionEditController.$inject = ['Logger', '$scope'];

		function DomicilioOrganizacionEditController ($log, $scope) {

			$log = $log.getInstance('DomicilioOrganizacionEditController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;

			vm.data = {
				domicilios : [],
				id : null
			};

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();
			function activate () { 
				vm.data.domicilios = $scope.$parent.vm.data.organizacion.Domicilios;
				vm.data.id = $scope.$parent.vm.data.id;
			}
		}
	};

	return module;
})();