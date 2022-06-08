import * as angular from 'angular';
import { ICredentialsDataService } from 'core/security';

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('GuardiaNewController', GuardiaNewController);

		// Inyección de Dependencia
		GuardiaNewController.$inject = [
			'$scope', '$log', '$filter', '$q', '$state', 'AlertaService', 'GuardiaAtencionDataService', 'ACTION_ATENCION',
			'TITLE_ATENCION', 'GuardiaAtencionLogicService', 'CieLogicService', 'CredentialsDataService'
		];

		// Constructor del Controller
		function GuardiaNewController(
			$scope, $log, $filter, $q, $state, AlertaService, GuardiaAtencionDataService, ACTION_ATENCION,
			TITLE_ATENCION, GuardiaAtencionLogicService, CieLogicService, CredentialsDataService: ICredentialsDataService) {

			$log.debug('GuardiaNewController: ON.-');


			var vm = this;
			vm.template = 'guardia/atencion/templates/detalle_prescripcion.tpl.html';
			vm.title = "Carga de Prescripcion";


			$scope.title = {
				module: TITLE_ATENCION.MODULE,
				page: TITLE_ATENCION.NEW
			};

			$scope.formData = {
				tipoIndicacion: '',
				medicamento: '',
				prioridad: '',
				descartable: ''
				// tipoAlta: ''
				// Información del formulario
			};

			$scope.data = {
				// Información traida desde la BD
				prescripcion: '',
				paciente: '',
				indicacionesCargadas: [],
				tipoIndicaciones: [],
				indicaciones: [],
				indicacionesFavoritas: [],
				prioridades: [],
				prioridadDefault: {},
				medicamentos: [],
				medicamentosCarga: [],
				tiposDosis: [],
				vias: [],
				descartables: [],
				medicamentosStock: [],
				medicamentosAll: [],
				esUrgencia: false,
				pedidos: [] 
				// tipoAlta: [],
				// user: User// Usuario con rol del modulo
			};

			$scope.formControl = {
				// Manejo del formulario
				error: true,
				loading: false,
				tipoIndicacionCargada: false,
				indicacionTildada: false,
				indicacionTipeada: false,
				medicamentoCargado: false,
				nuevoPaciente: false,
				alta: false,
				tipoAltaCargado: false,
				medico: true,
				supervisor: false,
				vacio: false,
				diagnosticoCargado: false,
				medicamentoOk: false,
				hayPedidos: false,

				limpiar: limpiar,
				guardar: guardar,
				reloadPage: activate,
				volver: volver,
				validarForm: validarForm,
				llenarForm: llenarForm,
				cargarIndicaciones: cargarIndicaciones,
				newMedicamento: newMedicamento,
				newDescartable: newDescartable,
				// editMedicamento: editMedicamento,
				deleteMedicamento: deleteMedicamento,
				tildarIndicacion: tildarIndicacion,
				tipearIndicacion: tipearIndicacion,
				datoCargado: datoCargado,
				verMedicamentos: verMedicamentos,
				urgencia: urgencia,
				suma: suma,
				resta: resta,
				colorearPrioridad: colorearPrioridad,
				cargarDiagnostico: cargarDiagnostico,
				tipearMedicamento: tipearMedicamento,
				verPedidos: verPedidos
			};

			$scope.validar = {
				// error: validarError
			};

			function limpiar() {
				$scope.formData.tipoIndicacion = undefined;
				$scope.formControl.tipoIndicacionCargada = false;
				$scope.formControl.hayPedidos = false;
				// $scope.formData.esUrgencia = false;
				cargarIndicaciones();
				tipearIndicacion();
			}



			function guardar() {
				var prescripcion = angular.copy($scope.data.prescripcionDto);
				prescripcion.Id = ($scope.formControl.nuevoPaciente) ? 0 : $scope.data.prescripcion.Id;
				prescripcion.IdDiagnostico = $scope.formData.diagnostico.id_cie_enfermedad;
				prescripcion.IdUbicacion = $scope.data.ubicacion.id_ubicacion;

				prescripcion.IdSucursal = $scope.data.idSucursal;
				prescripcion.IdPaciente = parseInt(GuardiaAtencionDataService.clavePaciente);

				var detalle = angular.copy($scope.data.detalleDto);
				detalle.ObservacionMedica = $scope.formData.indicacion.ObservacionMedica;
				detalle.IdPrioridad = $scope.formData.indicacion.Prioridad.Id;
				detalle.Urgencia = $scope.formData.esUrgencia;
				detalle.IdIndicacion = $scope.formData.indicacion.Id;
				detalle.IdTipoIndicacion = $scope.formData.tipoIndicacion.Id;

				detalle.Materiales = [];
				var material : any= {};
				for (var i = $scope.data.medicamentosCarga.length - 1; i >= 0; i--) {
					material = angular.copy($scope.data.materialDto);
					material.IdProducto = $scope.data.medicamentosCarga[i].Id;
					material.Cantidad = $scope.data.medicamentosCarga[i].cantidad;
					if (!$scope.formData.esUrgencia) {
						material.Dosis = $scope.data.medicamentosCarga[i].Dosis;
						material.IdVia = $scope.data.medicamentosCarga[i].Via.Id;
						material.IdTipoDosis = $scope.data.medicamentosCarga[i].TipoDosis.Id;
					}
					detalle.Materiales.push(material);
				}
				prescripcion.Detalles = [];
				prescripcion.Detalles.push(detalle);
				$log.debug("Cargar Prescripcion: ", prescripcion);
				GuardiaAtencionDataService.cargarPrescripcion(prescripcion)
					.then(function (idDetalle) {
						if ($scope.formControl.hayPedidos) {
							var pedidos = {
								IdPrescripcionDetalle: idDetalle,
								Pedidos: <Array<any>>[]
							};
							for (var i = 0; i < $scope.data.pedidos.length; i++) {
								pedidos.Pedidos.push($scope.data.pedidos[i].Id);
							}
							GuardiaAtencionDataService.asociarPedidos(pedidos)
								.then(function (res) {
									AlertaService.NewSuccess('Indicacion Cargada');
									$scope.formControl.vacio = false;
								});
						}
						else {
							AlertaService.NewSuccess('Indicacion Cargada');
						}
						limpiar();
						actualizarPrescripcion();
					});

			}

			function suma(pMaterial) {
				for (var i = 0; i < $scope.data.medicamentosCarga.length; i++) {
					if ($scope.data.medicamentosCarga[i].Id == pMaterial.Id) {
						$scope.data.medicamentosCarga[i].cantidad += 1;
						$scope.data.medicamentosCarga[i].minimo = false;
						if ($scope.data.medicamentosCarga[i].cantidad == $scope.data.medicamentosCarga[i].StockNuevaCordoba) {
							$scope.data.medicamentosCarga[i].maximo = true;
						}
					}
				}
			}

			function resta(pMaterial) {
				for (var i = 0; i < $scope.data.medicamentosCarga.length; i++) {
					if ($scope.data.medicamentosCarga[i].Id == pMaterial.Id) {
						$scope.data.medicamentosCarga[i].cantidad -= 1;
						$scope.data.medicamentosCarga[i].maximo = false;
						if ($scope.data.medicamentosCarga[i].cantidad == 0) {
							$scope.data.medicamentosCarga[i].minimo = true;
						}
					}
				}
			}

			function volver() {
				// Ejemplo
				$state.go('guardiaAtencion.list');
				// $location.url('/Guardia/Atencion/List');
			}

			// function validarError(pBool) {
			// 	if (!pBool) {
			// 		return 'error';
			// 	}
			// }

			function validarForm() {
				// body...
			}

			function llenarForm() {
				// body...
			}

			function colorearPrioridad(pPrioridad) {
				return GuardiaAtencionLogicService.colorearPrioridad(pPrioridad);
			}


			function cargarIndicaciones() {
				$scope.data.indicaciones = [];
				$scope.data.medicamentosCarga = [];
				$scope.formData.indicacion = '';
				$scope.formData.medicamento = '';
				$scope.formControl.indicacionTipeada = false;
				$scope.formControl.indicacionTildada = false;

				if ($scope.formData.tipoIndicacion == undefined) {
					$scope.formControl.tipoIndicacionCargada = false;
				}
				else {
					if ($scope.formData.tipoIndicacion.Nombre == "Practica Medica") {
						getPracticasMedicas();
					} else {
						getAccionesEnfermeria();
					}
				}
			}

			// function darAlta() {
			// 	$scope.formControl.alta = !$scope.formControl.alta;
			// }

			function getPracticasMedicas() {
				$scope.formControl.loading = true;
				$scope.formControl.tipoIndicacionCargada = true;
				var _practicas = GuardiaAtencionDataService.getPracticasMedicas();
				// var _practicasFav = GuardiaAtencionDataService.getPracticasMedicasFavoritas();

				$q.all([_practicas])
					.then(function (results) {
						$scope.data.indicaciones = results[0];
						$scope.data.indicacionesFavoritas = [];
						$scope.formControl.loading = false;
						for (var i = 0; i < $scope.data.indicaciones.length; i++) {
							if ($scope.data.indicaciones[i].NombreBusqueda && $scope.data.indicaciones[i].NombreBusqueda != '') {
								$scope.data.indicaciones[i].Nombre = $scope.data.indicaciones[i].NombreBusqueda;
							}
							if ($scope.data.indicaciones[i].Favorito) {
								$scope.data.indicacionesFavoritas.push($scope.data.indicaciones[i]);
							}
						}
					});
			}

			function getAccionesEnfermeria() {
				$scope.formControl.loading = true;
				$scope.formControl.tipoIndicacionCargada = true;
				var _acciones = GuardiaAtencionDataService.getAccionesEnfermeria();
				// var _accionesFav = GuardiaAtencionDataService.getAccionesEnfermeriaFavoritos();

				$q.all([_acciones])
					.then(function (results) {
						$scope.data.indicaciones = results[0];
						$scope.data.indicacionesFavoritas = [];
						$scope.formControl.loading = false;
						$log.debug("indicaciones", results[0]);
						for (var i = 0; i < $scope.data.indicaciones.length; i++) {
							if ($scope.data.indicaciones[i].Favorito) {
								$scope.data.indicacionesFavoritas.push($scope.data.indicaciones[i]);
							}
						}
					});
			}

			function tildarIndicacion(index) {
				$scope.formControl.indicacionTildada = $scope.data.indicacionesFavoritas[index].cargada;
				$scope.formData.indicacion = $scope.data.indicacionesFavoritas[index];
				$log.debug('indicacion', $scope.formData.indicacion);
				$scope.formData.indicacion.Prioridad = {
					Nombre: 'NO URGENTE',
					Id: 4
				};
			}


			function tipearIndicacion() {
				$log.debug('tipearIndicacion');
				for (var i = 0; i < $scope.data.indicacionesFavoritas.length; i++) {
					$scope.data.indicacionesFavoritas[i].cargada = false;
				}
				if ($scope.formData.indicacion.Nombre != undefined) {
					$scope.formControl.indicacionTipeada = true;
					$scope.formControl.indicacionTildada = false;
					$scope.formData.indicacion.Prioridad = {
						Nombre: 'NO URGENTE',
						Id: 4
					};
				}
				else {
					$scope.formControl.indicacionTipeada = false;
					$scope.formControl.indicacionTildada = false;
				}
			}

			function datoCargado() {
				if ($scope.formData.esUrgencia) {
					$scope.formControl.medicamentoCargado = $scope.formControl.medicamentoOk;
				}
				else {
					$scope.formControl.medicamentoCargado = GuardiaAtencionLogicService
						.datosCompletosMedicamento($scope.formData.medicamento);
				}
				$scope.formControl.descartableCargado = GuardiaAtencionLogicService.datosCompletosDescartable($scope.formData.descartable);
				$log.debug("descartable", $scope.formData.descartable);
			}

			function newMedicamento() {
				if ($scope.formData.medicamento.Id) {
					if (!$scope.formData.medicamento.cantidad) {
						$scope.formData.medicamento.cantidad = 0;
						$scope.formData.medicamento.minimo = true;
					}
					if ($scope.formData.medicamento.StockNuevaCordoba == 0) {
						$scope.formData.medicamento.maximo = true;
						$scope.formData.medicamento.minimo = true;
					}
					// $scope.data.medicamentosCarga = GuardiaAtencionLogicService
					// 									.addFromList($scope.data.medicamentosCarga,$scope.formData.medicamento);
					// $scope.data.medicamentos[k]
					var existe = false;
					for (var i = 0; i < $scope.data.medicamentosCarga.length; i++) {
						if ($scope.data.medicamentosCarga[i].Id == $scope.formData.medicamento.Id)
							existe = true;
					}
					if (!existe)
						$scope.data.medicamentosCarga.push($scope.formData.medicamento);
					$scope.formData.medicamento = '';
					tipearMedicamento();
					$log.debug("scope.data.medicamentosCarga", $scope.data.medicamentosCarga);
				}

			}

			function newDescartable() {
				if ($scope.formData.descartable.Id) {
					if (!$scope.formData.descartable.cantidad) {
						$scope.formData.descartable.cantidad = 0;
						$scope.formData.descartable.minimo = true;
					}
					if ($scope.formData.descartable.StockNuevaCordoba == 0) {
						$scope.formData.descartable.maximo = true;
						$scope.formData.descartable.minimo = true;
					}

					var existe = false;
					for (var i = 0; i < $scope.data.medicamentosCarga.length; i++) {
						if ($scope.data.medicamentosCarga[i].Id == $scope.formData.descartable.Id)
							existe = true;
					}
					if (!existe)
						$scope.data.medicamentosCarga.push($scope.formData.descartable);

					$scope.formData.descartable = '';
					datoCargado();
				}
			}

			function deleteMedicamento(index) {
				// $scope.data.medicamentosCarga = GuardiaAtencionLogicService.deleteFromList($scope.data.medicamentosCarga, index);
				$scope.data.medicamentosCarga.splice(index, 1);
				$log.debug('Eliminada', index, $scope.data.medicamentosCarga);
			}


			function verMedicamentos(pIndex) {
				var estado = $scope.data.prescripcion.Detalles[pIndex].verMateriales;
				for (var i = 0; i < $scope.data.prescripcion.Detalles.length; i++) {
					$scope.data.prescripcion.Detalles[i].verMateriales = false;
				}

				$scope.data.prescripcion.Detalles[pIndex].verMateriales = !estado;

				if ($scope.data.prescripcion.Detalles[pIndex].Materiales.length == 0) {
					$scope.data.prescripcion.Detalles[pIndex].noMateriales = true;
				}
				$log.debug('detalle', $scope.data.prescripcion.Detalles[pIndex]);
			}


			function urgencia() {
				limpiar();
				if ($scope.formData.esUrgencia) {
					$scope.data.medicamentos = $scope.data.medicamentosStock;
					$log.debug("esUrgencia", $scope.data.medicamentos);
				}
				else {
					$scope.data.medicamentos = $scope.data.medicamentosAll;
					$log.debug("NOesUrgencia", $scope.data.medicamentos);
				}

			}

			function inicializarVariables() {

				// $scope.formControl.listoAlta = true;
				for (var i = 0; i < $scope.data.prescripcion.Detalles.length; i++) {
					// datosIndicacion($scope.data.prescripcion.Detalles[i].Indicacion,i);
					if ($scope.data.prescripcion.Detalles[i].ObservacionMedica &&
						$scope.data.prescripcion.Detalles[i].ObservacionMedica != '') {
						$scope.data.prescripcion.Detalles[i].observacionMedica = true;
					}
					if ($scope.data.prescripcion.Detalles[i].ObservacionEnfermeria != '' &&
						$scope.data.prescripcion.Detalles[i].ObservacionEnfermeria != null) {
						$scope.data.prescripcion.Detalles[i].observacionEnfermeria = true;
					}
				}
				$scope.formControl.loading = false;
			}

			function actualizarPrescripcion() {
				GuardiaAtencionDataService.getPrescripcionByIdPaciente()
					.then(function (_prescripcion) {
						$scope.data.prescripcion = _prescripcion;
						inicializarVariables();
					});
			}

			function cargarDiagnostico() {
				CieLogicService.openSelector(GuardiaAtencionDataService.usuario)
					.then(function (pDiagnostico) {
						$scope.formData.diagnostico = pDiagnostico;
						$log.debug($scope.formData.diagnostico);
						if ($scope.formData.diagnostico.titulo_cie_enfermedad != undefined) {
							$scope.formControl.diagnosticoCargado = true;
						}
						else {
							$scope.formControl.diagnosticoCargado = false;
						}
					});
			}

			function tipearMedicamento() {
				if ($scope.formData.medicamento.Id) {
					$scope.formControl.medicamentoOk = true;
				}
				else {
					$scope.formControl.medicamentoOk = false;
				}
				datoCargado();
			}

			function verPedidos() {
				GuardiaAtencionLogicService.viewPedidos(GuardiaAtencionDataService.usuario, $scope.data.pedidos)
					.then(function (pPedidos) {
						$scope.data.pedidos = pPedidos;
						$log.debug("pedidos", pPedidos);
						for (var i = 0; i < pPedidos.length; i++) {
							for (var j = 0; j < pPedidos[i].Detalles.length; j++) {
								for (var k = 0; k < $scope.data.medicamentos.length; k++) {
									if ($scope.data.medicamentos[k].Id == pPedidos[i].Detalles[j].Material.Id) {
										$log.debug("pPedidos[i].Detalles[j]", pPedidos[i].Detalles[j]);
										$scope.data.medicamentos[k].cantidad = pPedidos[i].Detalles[j].CantidadPedida;
										if ($scope.data.medicamentos[k].cantidad >= $scope.data.medicamentos[k].StockNuevaCordoba) {
											$log.debug('medicamentos[k]', $scope.data.medicamentos[k]);
											$scope.data.medicamentos[k].cantidad = $scope.data.medicamentos[k].StockNuevaCordoba;
											$scope.data.medicamentos[k].maximo = true;
											if ($scope.data.medicamentos[k].StockNuevaCordoba == 0) {
												$scope.data.medicamentos[k].minimo = true;
											}
										}
										// $scope.data.medicamentosCarga.push($scope.data.medicamentos[k]);
										// $scope.data.medicamentosCarga = GuardiaAtencionLogicService.addFromList($scope.data.medicamentosCarga,$scope.data.medicamentos[k]);
										$scope.data.medicamentosCarga.push($scope.data.medicamentos[k]);
										$scope.formControl.hayPedidos = true;
									}
								}
								// $scope.data.medicamentosCarga = GuardiaAtencionLogicService.addFromList($scope.data.medicamentosCarga,pPedidos[i].Detalles[j].Material);
							}
						}
					});
			}


			activate();
			/* Método inicializador */
			function activate() {
				GuardiaAtencionDataService.usuario = CredentialsDataService.GetForce();
				$log.debug('GuardiaNewController: Inicializar ON.-', GuardiaAtencionDataService.usuario);
				if (!GuardiaAtencionDataService.usuario) {
					$state.go('guardiaAtencion.list');
					return;
				}
				for (var i = GuardiaAtencionDataService.usuario.permisos.length - 1; i >= 0; i--) {
					if (GuardiaAtencionDataService.usuario.permisos[i].Id == 200) {
						$scope.formControl.supervisor = true;
					}
				}
				if (!GuardiaAtencionDataService.prescripcion && !GuardiaAtencionDataService.clavePaciente) {
					$state.go('guardiaAtencion.list');
					return;
				}
				else {
					$scope.formControl.loading = true;
					if (GuardiaAtencionDataService.externo) {
						GuardiaAtencionDataService.getPrescripcionByIdPaciente()
							.then(function (pPrescripcion) {
								if (pPrescripcion && pPrescripcion != '') {
									$log.debug('pPrescripcion', pPrescripcion);
									$scope.data.prescripcion = pPrescripcion;
									GuardiaAtencionDataService.prescripcion = pPrescripcion;
								}
								else {
									$scope.formControl.nuevoPaciente = true;
								}
								activateOk();
							}, function (pError) {
								$log.debug("pError", pError);
								if (pError.statusCode == 204) {
									$scope.formControl.nuevoPaciente = true;
									activateOk();
								}
								else {
									// ModalService.error(pError.message);
								}
							});
					}
					else {
						GuardiaAtencionDataService.getPrescripcionByIdPaciente()
							.then(function (pPrescripcion) {
								$log.debug('pPrescripcion', pPrescripcion);
								$scope.data.prescripcion = pPrescripcion;
								GuardiaAtencionDataService.prescripcion = pPrescripcion;
								activateOk();
							});
					}
				}
			}

			function activateOk() {
				// var _prescripcion = GuardiaAtencionDataService.getPrescripcionByIdPaciente();
				var _usuario = GuardiaAtencionDataService.getUsuarioByNombre(GuardiaAtencionDataService.usuario.userName);
				var _medicamentos = GuardiaAtencionDataService.getAllMedicamentos();
				var _prioridades = GuardiaAtencionDataService.getAllPrioridades();
				var _vias = GuardiaAtencionDataService.getAllVias();
				var _tiposDosis = GuardiaAtencionDataService.getAllTiposDosis();
				var _tipoAlta = GuardiaAtencionDataService.getTipoAlta();
				var _descartables = GuardiaAtencionDataService.getAllDescartablesByUbicacion();
				var _medicamentosStock = GuardiaAtencionDataService.getAllMedicamentosByUbicacion();
				var _tiposIndicacion = GuardiaAtencionDataService.getTiposIndicacion();
				var _prescripcionDto = GuardiaAtencionDataService.getPrescripcionDto();
				var _detalleDto = GuardiaAtencionDataService.getDetalleDto();
				var _materialDto = GuardiaAtencionDataService.getMaterialDto();


				var _paciente = GuardiaAtencionDataService.getPacienteById();
				var _ubicacion = {};
				if (GuardiaAtencionDataService.externo) {
					$scope.data.idSucursal = parseInt(GuardiaAtencionDataService.sucursal);
				}
				else {
					$scope.data.idSucursal = GuardiaAtencionDataService.usuario.sucursales[0].Id;
				}
				_ubicacion = GuardiaAtencionDataService.getUbicacionBySucursal($scope.data.idSucursal);

				$q.all([_usuario, _medicamentos, _prioridades, _vias, _tiposDosis, _paciente, _tipoAlta,
					_descartables, _medicamentosStock, _tiposIndicacion, _ubicacion,
					_prescripcionDto, _detalleDto, _materialDto])
					.then(function (pResult) {
						// GuardiaAtencionDataService.prescripcion = pResult[0];
						GuardiaAtencionDataService.usuario.id_usuario = pResult[0].Id;
						$scope.data.medicamentosAll = pResult[1];
						$scope.data.prioridades = pResult[2];
						$scope.data.vias = pResult[3];
						$scope.data.tiposDosis = pResult[4];
						$scope.data.paciente = pResult[5];
						$scope.data.tipoAlta = pResult[6];
						$scope.data.descartables = pResult[7];
						$scope.data.medicamentosStock = pResult[8];
						$scope.data.tipoIndicaciones = pResult[9];
						$scope.data.ubicacion = pResult[10];
						$scope.data.prescripcionDto = pResult[11];
						$scope.data.detalleDto = pResult[12];
						$scope.data.materialDto = pResult[13];

						urgencia();
						if (!$scope.formControl.nuevoPaciente) {
							$scope.formData.diagnostico = {
								titulo_cie_enfermedad: $scope.data.prescripcion.Diagnostico
							};
							inicializarVariables();
							$scope.formControl.diagnosticoCargado = true;
						}
						else {
							$scope.formControl.vacio = true;
							$scope.formControl.loading = false;
						}

						$log.debug("GuardiaNewController: activateOk User", GuardiaAtencionDataService.usuario);
					}, function (pError) {
						// ModalService.error(pError.message);
						$log.error("GuardiaNewController: activateError", pError);
					});
			}

		}
	};

	return module;
})();