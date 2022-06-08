/**
 * @author:			Jorge Basiluk
 * @description:	General
 * @type:			Controller
 **/
import { IProfesionalesDataService } from '../../services';
import * as angular from 'angular';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('GeneralProfesionalEditController', GeneralProfesionalEditController);

		GeneralProfesionalEditController.$inject = ['Logger', '$scope', 'DateUtils', 'ProfesionalesDataService', 'moment'];

		function GeneralProfesionalEditController($log, $scope, DateUtils, ProfesionalesDataService: IProfesionalesDataService, moment) {

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.filter = {
				cuit: '',
				numeroIibb: '',
				fechaVigenciaEximicionIibb: null,
				observaciones: '',
				activo: false,
				idTipoDocumento: 0,
				numeroDocumento: '',
				fechaNacimiento: null,
				idTipoSexo: 0,
				email: '',
				visiblePortalWeb: false,
				idEspecialidadMedica: 0,
				idServicioPorDefecto: 0,
				numeroMatriculaEspecialista: '',
				idTipoDeProfesional: 0,
				idCategoriaDelProfesional: 0,
				esResidente: false,
				fechaHoy : new Date(),
				startDate : new Date('1900-01-01')
			}

			vm.formControl = {
				activoChange: activoChange,
				cuitChange: cuitChange,
				observacionesChange: observacionesChange,
				numeroIibbChange: numeroIibbChange,
				emailChange: emailChange,
				tipoSexoChange: tipoSexoChange,
				visiblePortalWebChange: visiblePortalWebChange,
				especialidadMedicaChange: especialidadMedicaChange,
				servicioPorDefectoChange: servicioPorDefectoChange,
				numeroMatriculaEspecialistaChange: numeroMatriculaEspecialistaChange,
				tipoDeProfesionalChange: tipoDeProfesionalChange,
				esResidenteChange: esResidenteChange,
				tipoDocumentoChange: tipoDocumentoChange,
				numeroDocumentoChange: numeroDocumentoChange,
				cambioCategoriaChange : cambioCategoriaChange
			}

			vm.data = {
				tiposDocumentos: [],
				tiposSexo: [],
				especialidadesMedicas: [],
				tiposProfesionales: [],
				servicios: [],
				tiposCategoria: []
			};

			/* ---------------------------------------------- FORMULARIO ---------------------------------------------- */

			function activoChange() {
				$scope.$parent.vm.data.profesionalEdit.Activo = vm.filter.activo;
			}

			function esResidenteChange() {
				$scope.$parent.vm.data.profesionalEdit.EsResidente = vm.filter.esResidente;
			}

			function tipoSexoChange() {
				$scope.$parent.vm.data.profesionalEdit.IdTipoSexo = vm.filter.idTipoSexo;
			}

			function emailChange() {
				$scope.$parent.vm.data.profesionalEdit.Email = vm.filter.email;
			}

			function especialidadMedicaChange() {
				$scope.$parent.vm.data.profesionalEdit.IdEspecialidadMedica = vm.filter.idEspecialidadMedica;
			}

			function servicioPorDefectoChange() {
				$scope.$parent.vm.data.profesionalEdit.IdServicioPorDefecto = vm.filter.idServicioPorDefecto;
			}

			function numeroMatriculaEspecialistaChange() {
				$scope.$parent.vm.data.profesionalEdit.NumeroMatriculaEspecialista = (vm.filter.numeroMatriculaEspecialista) ?  vm.filter.numeroMatriculaEspecialista : 0;
			}

			function tipoDeProfesionalChange() {
				$scope.$parent.vm.data.profesionalEdit.IdTipoDeProfesional = vm.filter.idTipoDeProfesional;
			}

			function visiblePortalWebChange() {
				$scope.$parent.vm.data.profesionalEdit.VisiblePortalWeb = vm.filter.visiblePortalWeb;
			}

			function cuitChange() {
				$scope.$parent.vm.data.profesionalEdit.NumeroCuit = vm.filter.cuit;
			}

			function numeroIibbChange() {
				$scope.$parent.vm.data.profesionalEdit.NumeroIibb = vm.filter.numeroIibb;
			}

			function observacionesChange() {
				$scope.$parent.vm.data.profesionalEdit.Observaciones = vm.filter.observaciones;
			}

			function tipoDocumentoChange() {
				$scope.$parent.vm.data.profesionalEdit.IdTipoDocumento = vm.filter.idTipoDocumento;
			}

			function numeroDocumentoChange() {
				$scope.$parent.vm.data.profesionalEdit.NumeroDocumento = vm.filter.numeroDocumento;
			}

			function cambioCategoriaChange() {
				$scope.$parent.vm.data.profesionalEdit.IdCategoriaDelProfesional = vm.filter.idCategoriaDelProfesional;
			}

			$scope.$watch(function () {
				return vm.filter.fechaVigenciaEximicionIibb;
			}, function () {
				$scope.$parent.vm.data.profesionalEdit.FechaVigenciaEximicionIibb = DateUtils.parseToBe(vm.filter.fechaVigenciaEximicionIibb);
			});

			$scope.$watch(function () {
				return vm.filter.fechaNacimiento;
			}, function () {
				$scope.$parent.vm.data.profesionalEdit.FechaNacimiento = DateUtils.parseToBe(vm.filter.fechaNacimiento);
			});
			
			
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function activate() {
				vm.formControl.loading = true;

				vm.filter.activo = $scope.$parent.vm.data.profesionalEdit.Activo;
				vm.filter.cuit = $scope.$parent.vm.data.profesionalEdit.NumeroCuit;
				if ($scope.$parent.vm.data.profesionalEdit.TieneFechaVigenciaEximicionIibb) {
					vm.filter.fechaVigenciaEximicionIibb = angular.copy(new Date(moment($scope.$parent.vm.data.profesionalEdit.FechaVigenciaEximicionIibb)));
				}else {
					if($scope.$parent.vm.data.profesionalEdit.FechaVigenciaEximicionIibb != null) {
						if (!$scope.$parent.vm.data.profesionalEdit.FechaVigenciaEximicionIibb.includes('0001-01-01')){
							// tiene una fecha previa seteada
							vm.filter.fechaVigenciaEximicionIibb = new Date(moment($scope.$parent.vm.data.profesionalEdit.FechaVigenciaEximicionIibb))
						}
					}
				}
				if ($scope.$parent.vm.data.profesionalEdit.NumeroIibb > 0) vm.filter.numeroIibb = $scope.$parent.vm.data.profesionalEdit.NumeroIibb;
				vm.filter.observaciones = $scope.$parent.vm.data.profesionalEdit.Observaciones;
				vm.filter.numeroDocumento = $scope.$parent.vm.data.profesionalEdit.NumeroDocumento;

				if ($scope.$parent.vm.data.profesionalEdit.TieneFechaNacimiento){
					vm.filter.fechaNacimiento = angular.copy(new Date(moment($scope.$parent.vm.data.profesionalEdit.FechaNacimiento)));
				}else {
					if($scope.$parent.vm.data.profesionalEdit.FechaNacimiento != null) {
						if (!$scope.$parent.vm.data.profesionalEdit.FechaNacimiento.includes('0001-01-01')) {
							// tiene una fecha previa seteada
							vm.filter.fechaNacimiento = new Date(moment($scope.$parent.vm.data.profesionalEdit.FechaNacimiento))
						}
					}
				}

				vm.filter.email = $scope.$parent.vm.data.profesionalEdit.Email;
				if ($scope.$parent.vm.data.profesionalEdit.NumeroMatriculaEspecialista > 0) vm.filter.numeroMatriculaEspecialista = $scope.$parent.vm.data.profesionalEdit.NumeroMatriculaEspecialista;
				vm.filter.esResidente = $scope.$parent.vm.data.profesionalEdit.EsResidente;
				vm.filter.visiblePortalWeb = $scope.$parent.vm.data.profesionalEdit.VisiblePortalWeb;

				ProfesionalesDataService.ObtenerTodosTipoSexo().then(function (tiposSexo) {
					vm.data.tiposSexo = tiposSexo;
					if ($scope.$parent.vm.data.profesionalEdit.IdTipoSexo > 0) vm.filter.idTipoSexo = $scope.$parent.vm.data.profesionalEdit.IdTipoSexo;
				});
				ProfesionalesDataService.ObtenerTodosEspecialidadMedica().then(function (especialidadesMedicas) {
					vm.data.especialidadesMedicas = especialidadesMedicas;
					if ($scope.$parent.vm.data.profesionalEdit.IdEspecialidadMedica > 0) vm.filter.idEspecialidadMedica = $scope.$parent.vm.data.profesionalEdit.IdEspecialidadMedica;
				});
				ProfesionalesDataService.ObtenerTodosServicios().then(function (servicios) {
					vm.data.servicios = servicios;
					if ($scope.$parent.vm.data.profesionalEdit.IdServicioPorDefecto > 0) vm.filter.idServicioPorDefecto = $scope.$parent.vm.data.profesionalEdit.IdServicioPorDefecto;
				});
				ProfesionalesDataService.ObtenerTodosTipoProfesional().then(function (tiposProfesionales) {
					vm.data.tiposProfesionales = tiposProfesionales;
					if ($scope.$parent.vm.data.profesionalEdit.IdTipoDeProfesional > 0) vm.filter.idTipoDeProfesional = $scope.$parent.vm.data.profesionalEdit.IdTipoDeProfesional;
				});
				ProfesionalesDataService.ObtenerTodosTipoDocumento().then(function (tiposDocumentos) {
					vm.data.tiposDocumentos = tiposDocumentos;
					if ($scope.$parent.vm.data.profesionalEdit.IdTipoDocumento > 0) vm.filter.idTipoDocumento = $scope.$parent.vm.data.profesionalEdit.IdTipoDocumento;
				});
				ProfesionalesDataService.ObtenerTodosTipoCategorias().then(function (tiposCategoria) {
					vm.data.tiposCategoria = tiposCategoria;
					if ($scope.$parent.vm.data.profesionalEdit.IdCategoriaDelProfesional > 0) vm.filter.idCategoriaDelProfesional = $scope.$parent.vm.data.profesionalEdit.IdCategoriaDelProfesional;
				});

				vm.formControl.loading = false;
			}
		}
	};

	return module;
})();