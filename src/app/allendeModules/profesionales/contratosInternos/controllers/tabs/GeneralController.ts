/**
 * @author:			Pedro Ferrer
 * @description:	General
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('GeneralController', GeneralController);

		GeneralController.$inject = ['Logger', '$state', 'ModalService', 'User', '$scope', 'ContratosInternosDataService', 'DateUtils'];

		function GeneralController ($log, $state, ModalService, User, $scope, ContratosInternosDataService, DateUtils) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('GeneralController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.data = {
            };
            
            vm.filter = {
				estadosContrato : '',
				idEstadoContratoElegido : '',
				modosContratacion : '',
				idModoContratacionElegido : '',
				condicionesIva : '',
				idCondicionIvaElegida : '',
				tiposGanancias : '',
				idTipoGananciaElegido : '',
				regimenesGanancia : '',
				idRegimenGananciaElegido : '',
				derechos : null,
				honorarios : null,
				vigenciaEximicion : null,
			};

			vm.formData = {
			};

			vm.formControl = {
				loading : false,
				contratoChange : contratoChange,
				contratacionChange : contratacionChange,
				condicionChange : condicionChange,
				tipoGananciasChange : tipoGananciasChange,
				regimenGananciasChange : regimenGananciasChange,
				derechosChange : derechosChange,
				honorariosChange : honorariosChange
			};
			

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function contratoChange(){
				$scope.$parent.vm.data.contratoEdit.IdEstadoContratoInterno = vm.filter.idEstadoContratoElegido;
			}

			function contratacionChange(){
				$scope.$parent.vm.data.contratoEdit.IdModoContratacion = vm.filter.idModoContratacionElegido;
			}

			function condicionChange(){
				$scope.$parent.vm.data.contratoEdit.IdCondicionIva = vm.filter.idCondicionIvaElegida;
			}

			function tipoGananciasChange(){
				$scope.$parent.vm.data.contratoEdit.IdTipoGanancia = vm.filter.idTipoGananciaElegido;
			}

			function regimenGananciasChange(){
				$scope.$parent.vm.data.contratoEdit.IdRegimenGanancia = vm.filter.idRegimenGananciaElegido;
			}

			function derechosChange(){
				$scope.$parent.vm.data.contratoEdit.PorcentajeParticipacionDerechos = vm.filter.derechos;
			}

			function honorariosChange(){
				$scope.$parent.vm.data.contratoEdit.PorcentajeParticipacionHonorarios = vm.filter.honorarios;
			}

			$scope.$watch(function () {
				return vm.filter.vigenciaEximicion;
			}, function() {
				$scope.$parent.vm.data.contratoEdit.FechaVigenciaEximicionGanancias = vm.filter.vigenciaEximicion;
				if($scope.$parent.vm.data.contratoEdit.FechaVigenciaEximicionGanancias) $scope.$parent.vm.data.contratoEdit.TieneFechaVigenciaEximicionGanancias = true;
			});
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
				vm.filter.derechos = $scope.$parent.vm.data.contratoEdit.PorcentajeParticipacionDerechos;
				vm.filter.honorarios = $scope.$parent.vm.data.contratoEdit.PorcentajeParticipacionHonorarios;
				if($scope.$parent.vm.data.contratoEdit.TieneFechaVigenciaEximicionGanancias) vm.filter.vigenciaEximicion = $scope.$parent.vm.data.contratoEdit.FechaVigenciaEximicionGanancias;

				ContratosInternosDataService.EstadoContratoInternoObtenerTodos().then(function(estadosContrato){
					vm.filter.estadosContrato = estadosContrato;
					if($scope.$parent.vm.data.contratoEdit.IdEstadoContratoInterno !== 0) vm.filter.idEstadoContratoElegido = $scope.$parent.vm.data.contratoEdit.IdEstadoContratoInterno;
				});

				ContratosInternosDataService.ModoContratacionObtenerTodos().then(function(modosContratacion){
					vm.filter.modosContratacion = modosContratacion;
					if($scope.$parent.vm.data.contratoEdit.IdModoContratacion !== 0) vm.filter.idModoContratacionElegido = $scope.$parent.vm.data.contratoEdit.IdModoContratacion;
				});

				ContratosInternosDataService.CondicionIvaObtenerTodos().then(function(condicionesIva){
					vm.filter.condicionesIva = condicionesIva;
					if($scope.$parent.vm.data.contratoEdit.IdCondicionIva !== 0) vm.filter.idCondicionIvaElegida = $scope.$parent.vm.data.contratoEdit.IdCondicionIva;
				});

				ContratosInternosDataService.TipoGananciaObtenerTodos().then(function(tiposGanancias){
					vm.filter.tiposGanancias = tiposGanancias;
					if($scope.$parent.vm.data.contratoEdit.IdTipoGanancia !== 0) vm.filter.idTipoGananciaElegido = $scope.$parent.vm.data.contratoEdit.IdTipoGanancia;
				});

				ContratosInternosDataService.RegimenGananciaObtenerTodos().then(function(regimenesGanancia){
					vm.filter.regimenesGanancia = regimenesGanancia;
					if($scope.$parent.vm.data.contratoEdit.IdRegimenGanancia !== 0) vm.filter.idRegimenGananciaElegido = $scope.$parent.vm.data.contratoEdit.IdRegimenGanancia;
				});
				vm.formControl.loading = false;
			}
		}
	};

	return module;
})();