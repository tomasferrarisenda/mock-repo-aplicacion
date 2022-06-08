/**
 * @author:			Jorge Basiluk
 * @description:	General
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('GeneralSociedadEditController', GeneralSociedadEditController);

		GeneralSociedadEditController.$inject = ['Logger', '$scope', 'SociedadProfesionalesDataService', 'DateUtils'];

		function GeneralSociedadEditController ($log, $scope, SociedadProfesionalesDataService, DateUtils) {

			//$log = $log.getInstance('GeneralSociedadEditController');
            
            /* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			
            vm.filter = {
				cuit : '',
				numeroIibb : '',
                fechaVigenciaEximicionIibb : '',
                observaciones : '',
				activo : false,
				idServicioPorDefecto : 0
			}
			
			vm.formControl = {
				activoChange : activoChange,
				cuitChange : cuitChange,
				observacionesChange: observacionesChange,
				numeroIibbChange : numeroIibbChange,
				servicioPorDefectoChange : servicioPorDefectoChange,
			}

			vm.data = {
				servicios: []
			};

			/* ---------------------------------------------- FORMULARIO ---------------------------------------------- */
			
			function activoChange(){
				$scope.$parent.vm.data.sociedadEdit.Activo = vm.filter.activo;
			}

			// /* FORMULARIO */
			
			function cuitChange(){
				$scope.$parent.vm.data.sociedadEdit.NumeroCuit = vm.filter.cuit;
			}

			function numeroIibbChange() {
			 	$scope.$parent.vm.data.sociedadEdit.NumeroIibb = vm.filter.numeroIibb;
			}

			function observacionesChange() {
			 	$scope.$parent.vm.data.sociedadEdit.Observaciones = vm.filter.observaciones;
			}

			function servicioPorDefectoChange() {
				$scope.$parent.vm.data.sociedadEdit.IdServicioPorDefecto = vm.filter.idServicioPorDefecto;
			}

			$scope.$watch(function() {
				return vm.filter.fechaVigenciaEximicionIibb;
			}, function() {
				$scope.$parent.vm.data.sociedadEdit.FechaVigenciaEximicionIibb = vm.filter.fechaVigenciaEximicionIibb;
				if($scope.$parent.vm.data.sociedadEdit.FechaVigenciaEximicionIibb) $scope.$parent.vm.data.sociedadEdit.TieneFechaVigenciaEximicionIibb = true;
			});

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function activate () {
                //$log.debug('data general', $scope.$parent.vm.data);
				vm.filter.activo = $scope.$parent.vm.data.sociedadEdit.Activo;
				vm.filter.cuit = $scope.$parent.vm.data.sociedadEdit.NumeroCuit;
				if($scope.$parent.vm.data.sociedadEdit.TieneFechaVigenciaEximicionIibb) vm.filter.fechaVigenciaEximicionIibb = $scope.$parent.vm.data.sociedadEdit.FechaVigenciaEximicionIibb;
                if($scope.$parent.vm.data.sociedadEdit.NumeroIibb > 0) vm.filter.numeroIibb = $scope.$parent.vm.data.sociedadEdit.NumeroIibb;
				vm.filter.observaciones = $scope.$parent.vm.data.sociedadEdit.Observaciones;
				
				SociedadProfesionalesDataService.ObtenerTodosServicios().then(function (servicios) {
					vm.data.servicios = servicios;
					if ($scope.$parent.vm.data.sociedadEdit.IdServicioPorDefecto > 0) vm.filter.idServicioPorDefecto = $scope.$parent.vm.data.sociedadEdit.IdServicioPorDefecto;
				});
			}
		}
	};

	return module;
})();