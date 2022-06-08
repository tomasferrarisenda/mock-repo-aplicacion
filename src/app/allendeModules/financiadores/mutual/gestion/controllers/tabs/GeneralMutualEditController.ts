/**
 * @author:			Pedro Ferrer
 * @description:	General
 * @type:			Controller
 **/
import { ISupportDataService } from '../../../../../support/basic/services';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('GeneralMutualEditController', GeneralMutualEditController);

		GeneralMutualEditController.$inject = ['Logger', '$scope', 'SupportDataService',
			'MutualDataService', 'OrganizacionDataService'];

		function GeneralMutualEditController($log, $scope, SupportDataService: ISupportDataService,
			MutualDataService, OrganizacionDataService) {

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.filter = {
				descripcion: '',
				observaciones: '',
				telefono: '',
				url: '',
				codigoOrganizacion : '',
				idTipoAfiliadoElegido: '',
				idTipoMutualElegida: '',
				idCondicionImpositivaElegida: '',
				estadoMutual: true,
				visibleEnTurnos : true,
				visibleEnTurnosWeb : false,
				usaPadrones : false,
				modulada : false,

				organizacionElegida : {},
				tipoAfiliado: [],
				tipoMutual: [],
				condicionImpositiva: [],
				mutualMadre: {},
				mutualFactura: {}
			}

			vm.formControl = {
				tipoAfiliadoChange: tipoAfiliadoChange,
				tipoMutualChange: tipoMutualChange,
				condicionChange: condicionChange,
				activoChange: activoChange,
				moduladaChange : moduladaChange,
				visibleEnTurnosChange : visibleEnTurnosChange,
				visibleEnTurnosWebChange : visibleEnTurnosWebChange,
				usaPadronesChange : usaPadronesChange,
				telefonoBlur: telefonoBlur,
				urlBlur: urlBlur,
				descripcionBlur: descripcionBlur,
				observacionesBlur: observacionesBlur
			}

			/* ---------------------------------------------- FORMULARIO ---------------------------------------------- */

			$scope.$watch(function () {
				return vm.filter.organizacionElegida;
			}, function (newVal) {
				if(newVal && newVal.Id){
					$scope.$parent.vm.data.mutual.IdOrganizacion = vm.filter.organizacionElegida.Id;
					$scope.$parent.vm.data.mutual.CodigoOrganizacion = vm.filter.organizacionElegida.Codigo;
				}
				else{
					$scope.$parent.vm.data.mutual.IdOrganizacion = 0;
					$scope.$parent.vm.data.mutual.CodigoOrganizacion = 0;
				}
			});

			function tipoAfiliadoChange() {
				$scope.$parent.vm.data.mutual.IdTipoAfiliado = vm.filter.idTipoAfiliadoElegido;
			}

			function tipoMutualChange() {
				$scope.$parent.vm.data.mutual.IdTipoMutual = vm.filter.idTipoMutualElegida;
			}

			function condicionChange() {
				$scope.$parent.vm.data.mutual.IdCondicionImpositiva = vm.filter.idCondicionImpositivaElegida;
			}

			function activoChange() {
				$scope.$parent.vm.data.mutual.Activo = vm.filter.estadoMutual;
			}

			function moduladaChange() {
				$scope.$parent.vm.data.mutual.Modulada = vm.filter.modulada;
			}

			function visibleEnTurnosChange() {
				$scope.$parent.vm.data.mutual.VisibleEnTurnos = vm.filter.visibleEnTurnos;
			}

			function visibleEnTurnosWebChange() {
				$scope.$parent.vm.data.mutual.VisibleEnTurnosWeb = vm.filter.visibleEnTurnosWeb;
			}

			function usaPadronesChange() {
				$scope.$parent.vm.data.mutual.UsaPadrones = vm.filter.usaPadrones;
			}

			function telefonoBlur() {
				$scope.$parent.vm.data.mutual.TelefonoAutorizaciones = vm.filter.telefono;
			}

			function urlBlur() {
				$scope.$parent.vm.data.mutual.UrlAutorizaciones = vm.filter.url;
			}

			function descripcionBlur() {
				$scope.$parent.vm.data.mutual.Descripcion = vm.filter.descripcion;
			}

			function observacionesBlur() {
				$scope.$parent.vm.data.mutual.Observaciones = vm.filter.observaciones;
			}

			$scope.$watch(function () {
				return vm.filter.mutualMadre;
			}, function () {
				if (vm.filter.mutualMadre) {
					$scope.$parent.vm.data.mutual.IdMutualMadre = vm.filter.mutualMadre.Id;
					$scope.$parent.vm.data.mutual.CodigoMutualMadre = vm.filter.mutualMadre.Codigo;
					$scope.$parent.vm.data.mutual.NombreMutualMadre = vm.filter.mutualMadre.Nombre;
				} else {
					$scope.$parent.vm.data.mutual.IdMutualMadre = 0;
					$scope.$parent.vm.data.mutual.CodigoMutualMadre = 0;
					$scope.$parent.vm.data.mutual.NombreMutualMadre = "";
				}
			});

			$scope.$watch(function () {
				return vm.filter.mutualFactura;
			}, function () {
				if (vm.filter.mutualFactura) {
					$scope.$parent.vm.data.mutual.IdMutualFactura = vm.filter.mutualFactura.Id;
					$scope.$parent.vm.data.mutual.CodigoMutualFactura = vm.filter.mutualFactura.Codigo;
					$scope.$parent.vm.data.mutual.NombreMutualFactura = vm.filter.mutualFactura.Nombre;
				} else {
					$scope.$parent.vm.data.mutual.IdMutualFactura = 0;
					$scope.$parent.vm.data.mutual.CodigoMutualFactura = 0;
					$scope.$parent.vm.data.mutual.NombreMutualFactura = "";
				}
			});

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function activate() {
				vm.filter.estadoMutual = $scope.$parent.vm.data.mutual.Activo;
				vm.filter.visibleEnTurnos = $scope.$parent.vm.data.mutual.VisibleEnTurnos;
				vm.filter.visibleEnTurnosWeb = $scope.$parent.vm.data.mutual.VisibleEnTurnosWeb;
				vm.filter.usaPadrones = $scope.$parent.vm.data.mutual.UsaPadrones;
				vm.filter.descripcion = $scope.$parent.vm.data.mutual.Descripcion;
				vm.filter.observaciones = $scope.$parent.vm.data.mutual.Observaciones;
				vm.filter.telefono = $scope.$parent.vm.data.mutual.TelefonoAutorizaciones;
				vm.filter.url = $scope.$parent.vm.data.mutual.UrlAutorizaciones;
				vm.filter.codigoOrganizacion = $scope.$parent.vm.data.mutual.CodigoOrganizacion;
				vm.filter.modulada = $scope.$parent.vm.data.mutual.Modulada;

				SupportDataService.getAllTipoAfiliado().then(function (tipoAfiliado) {
					vm.filter.tipoAfiliado = tipoAfiliado;
					if ($scope.$parent.vm.data.mutual.IdTipoAfiliado !== 0) vm.filter.idTipoAfiliadoElegido = $scope.$parent.vm.data.mutual.IdTipoAfiliado;
				});

				SupportDataService.getAllTipoMutual().then(function (tipoMutual) {
					vm.filter.tipoMutual = tipoMutual;
					if ($scope.$parent.vm.data.mutual.IdTipoMutual !== 0) vm.filter.idTipoMutualElegida = $scope.$parent.vm.data.mutual.IdTipoMutual;
				});

				SupportDataService.getAllCondicionImpositiva().then(function (condicionImpositiva) {
					vm.filter.condicionImpositiva = condicionImpositiva;
					if ($scope.$parent.vm.data.mutual.IdCondicionImpositiva !== 0) vm.filter.idCondicionImpositivaElegida = $scope.$parent.vm.data.mutual.IdCondicionImpositiva;
				});

				if ($scope.$parent.vm.data.mutual.CodigoMutualMadre > 0) {
					MutualDataService.getMutualPorCodigo($scope.$parent.vm.data.mutual.CodigoMutualMadre).then(function (mutual) {
						vm.filter.mutualMadre = mutual;
					});
				}
				else {
					MutualDataService.obtenerNuevo().then(function (mutual) {
						vm.filter.mutualMadre = mutual;
					});
				}

				if ($scope.$parent.vm.data.mutual.CodigoMutualFactura > 0) {
					MutualDataService.getMutualPorCodigo($scope.$parent.vm.data.mutual.CodigoMutualFactura).then(function (mutual) {
						vm.filter.mutualFactura = mutual;
					});
				}
				else {
					MutualDataService.obtenerNuevo().then(function (mutual) {
						vm.filter.mutualFactura = mutual;
					});
				}
			}
		}
	};

	return module;
})();