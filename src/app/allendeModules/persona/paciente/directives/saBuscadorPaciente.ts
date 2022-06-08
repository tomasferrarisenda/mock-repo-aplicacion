/**
 * @author:			Pablo Pautasso
 * @description:	directiva para buscador de pacientes para modulo turnos
 * @type:			Directive
 **/
import * as angular from 'angular';
import saBuscadorPacienteView = require('../templates/sa-buscador-paciente.tpl.html');
import { IPacienteDataService } from '../../../persona/paciente/services';
import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		// REUTILIZABLE: [DIRECTIVE] Buscador general de @paciente. Se usa con [ng-model].
		module.directive('saBuscadorPaciente', saBuscadorPaciente);

		saBuscadorPaciente.$inject = ['$log', '$state', '$q', 'AlertaService', 'ModalService', '$timeout',
			'SupportDataService', 'PacienteDataService', 'PacienteLogicService', 'SupportLogicService',
			'TurnosStorageHelperService', 'ENV'
		];

		function saBuscadorPaciente($log, $state, $q, AlertaService, ModalService, $timeout,
			SupportDataService: ISupportDataService, PacienteDataService: IPacienteDataService, PacienteLogicService, SupportLogicService,
			TurnosStorageHelperService, ENV
		) {
			return {
				restrict: 'E',
				require: '?ngModel',
				scope: {
					title: '@?',
					
					label: '<?',

					btnMutualesDisabled: '=?',
					btnMutualesIf: '=?',

					btnVerTurnosDisabled: '=?',
					btnVerTurnosIf: '=?',

					btnEditarPacienteDisabled: '=?',
					btnEditarPacienteIf: '=?',

					telefonoDisabled: '=?',
					telefonoIf: '=?',

					celularDisabled: '=?',
					celularIf: '=?',

					emailDisabled: '=?',
					emailIf: '=?',

					nombreApellidoIf: '=',

					buscadorNombreApellidoIf: '=',

					chkboxMantenerDatosIf: '=',
					chkboxMantenerDatosModel: '=?',

					chkboxControlEdadIf: '=',
					chkboxControlEdadModel: '=?',

					btnActionExtraDisabled: '=?',
					btnActionExtraIf: '=?',
					btnActionExtraClass: '=?',
					btnActionExtraClick: '&?',
					btnActionExtraIcon: '=?',

					mutualesDisabled: '<?',

					selectorGrande: '<?',

					reprogramarTurnoPaciente: '&?'


				},
				template: saBuscadorPacienteView,
				link: function (scope, element, attrs, controller) {

					if (!controller) return;

					var numeroDocumentoInput = $('#txt_numero_documento');

					scope.chkboxMantenerDatosModel = angular.isUndefined(scope.chkboxMantenerDatosModel) ? true : scope.chkboxMantenerDatosModel;
					scope.chkboxControlEdadModel = angular.isUndefined(scope.chkboxControlEdadModel) ? true : scope.chkboxControlEdadModel;

					

					scope.data = {};
					scope.checkStatus = checkStatus;
					scope.checkStatusControlEdad = checkStatusControlEdad;
					scope.buscarPacientePorId = buscarPacientePorId;
					scope.loadFinanciadoresSelector = loadFinanciadoresSelector;

					scope.mutualesDisabled = angular.isUndefined(scope.mutualesDisabled) ? false : scope.mutualesDisabled;

					scope.selectorGrande = angular.isUndefined(scope.selectorGrande) ? false : scope.selectorGrande;

					scope.reprogramarTurno = reprogramarTurno;

					scope.storage = {
						keyPacienteStorage: "paciente-buscador-data",

					};

					scope.formControl = {

						search: search,
						clean: clean,
						// busquedaAvanzada: busquedaAvanzada,
						turnosPaciente: turnosPaciente,
						editarPaciente: editarPaciente,
						loading: false,
						handleEventProp: handleEventProp,
						changeAfiliacionDefecto: changeAfiliacionDefecto,
						actionExtraClick: actionExtraClick

					};


					scope.data.tiposDocumento = [];
					scope.data.pacienteObtenido = {};
					scope.data.tiposDoc = {
						id_tipo_documento: 1,
						// nombre_tipo_documento : "D.N.I"
					};



					/* ------------------------------------ IMPLEMENTACIÓN ------------------------------------- */

					function reprogramarTurno(idTurno) {
						scope.reprogramarTurnoPaciente({ idTurnoAReprogramar: idTurno });
					}


					function actionExtraClick() {
						scope.btnActionExtraClick();
					}

					function checkStatus(pValue) {
						scope.chkboxMantenerDatosModel = pValue;
					}

					function checkStatusControlEdad(pValue) {
						scope.chkboxControlEdadModel = pValue;
					}

					function updateDirective(paciente) {
						scope.data.pacienteObtenido = paciente;
						setearTelefonos();
					}

					function setModelDirective(paciente) {
						// updateDirective(paciente);
						if (paciente) PacienteLogicService.esPacienteVip(paciente);
						controller.$setViewValue(paciente);
					}

					function turnosPaciente() {

						$log.debug('turnosPaciente');

					}

					function changeAfiliacionDefecto(afiliacion) {

						$log.debug('afiliacion', afiliacion);

						if (scope.data.pacienteObtenido.Afiliaciones.find(x => x.PorDefecto === true)) {
							angular.forEach(scope.data.pacienteObtenido.Afiliaciones, function (mutual, key) {
								if (mutual.Id !== afiliacion.Id)
									mutual.PorDefecto = false;
							});
						} else {
							scope.data.pacienteObtenido.Afiliaciones.find(x => x.Id === afiliacion.Id).PorDefecto = true;
						}
					}

					function editarPaciente() {

						$log.debug('editarPaciente');
						if (scope.data.pacienteObtenido.Id) {

							setStoredData();
							//DEPRECADO
							// $state.go('paciente.edit', {
							// 	idPaciente: scope.data.pacienteObtenido.Id
							// });
							window.location.href = `${ENV.APP2}/paciente/edit/` + scope.data.pacienteObtenido.Id;
						}
						else AlertaService.NewWarning("Alerta",
							"Atencion, debe buscar un paciente para editarlo");


					}

					function search() {

					
						
						//si el paciente tiene propierties entonces algo setee 
						if (objHasProperties(scope.data.pacienteObtenido)) {

							//busco por numuero de documento y todos los tipos
							var numeroDoc = (scope.data.pacienteObtenido.NumeroDocumento) ?
								scope.data.pacienteObtenido.NumeroDocumento : null;

							// $log.debug('buscando paciente por documento todo tipo de doc', 0, numeroDoc);

							scope.formControl.loading = true;

							

							PacienteDataService.obtenerPacientePorDocumentoSelector(0, numeroDoc)
								.then(obtenerPacienteOk, obtenerPacienteError);

						} else {
							//sino abro el dialog
							SupportLogicService.openBuscadorPaciente(null, true, numeroDoc, true)
								.then(function (result) {

									$log.debug('resultselectorpaciente', result);
									buscarPacientePorId(result.Id)
										.then(function (pPaciente) {
											setModelDirective(pPaciente);
											cleanStorage();
										}, function (pError) {
											cleanStorage();
										});

									// scope.data.pacienteObtenido = result;
									// controller.$setViewValue(scope.data.pacienteObtenido);

								}, function (pError) {

									$log.error('selectorPacienteError', pError);

								});
						}


						function obtenerPacienteOk(pResult) {

							$log.debug('obtenerPacienteOk', pResult);

							//el resultado es unico no abro entonces el selector
							if (pResult.length == 1) {
								// seteo data y telefonos
								setModelDirective(pResult[0]);
								// scope.data.pacienteObtenido = pResult[0];
								// setearTelefonos();
								// controller.$setViewValue(scope.data.pacienteObtenido);

								scope.formControl.loading = false;


							} else {
								//la busqueda no produjo resultados desea hacerla mas exaustiva?
								// o
								// la busqueda trajo mas de un resultado, entonces debo elejir entre una serie de pacientes
								scope.formControl.loading = false;

								SupportLogicService.openBuscadorPaciente(pResult, true, scope.data.pacienteObtenido.NumeroDocumento, true)
									.then(function (result) {

										$log.debug('resultselectorpaciente', result);
										buscarPacientePorId(result.Id)
											.then(function (pPaciente) {
												setModelDirective(pPaciente);
												cleanStorage();
											}, function (pError) {
												cleanStorage();
											});

									}, function (pError) {

										$log.error('selectorPacienteError', pError);

									});

							}

						}

						function obtenerPacienteError(pError) {
							$log.error('obtenerPacienteError', pError);
						}

					}


					function loadFinanciadoresSelector() {

						var ret = "Mutuales";

						if (scope.data.pacienteObtenido) {

							if (scope.data.pacienteObtenido.Id) {

								if (scope.data.pacienteObtenido.Afiliaciones) {

									if (scope.data.pacienteObtenido.Afiliaciones.length == 1) {
										scope.data.pacienteObtenido.Afiliaciones[0].PorDefecto = true;
										ret = "Mutual: " +
											(scope.data.pacienteObtenido.Afiliaciones[0].MutualNombreCorto ? scope.data.pacienteObtenido.Afiliaciones[0].MutualNombreCorto : scope.data.pacienteObtenido.Afiliaciones[0].MutualNombre) + 
											" - " + scope.data.pacienteObtenido.Afiliaciones[0].PlanMutualNombre;
									} else if (scope.data.pacienteObtenido.Afiliaciones.length > 1) {

										angular.forEach(scope.data.pacienteObtenido.Afiliaciones, function (mutual, key) {
											if (mutual.PorDefecto === true) {
												ret = "Mutual: " + (mutual.MutualNombreCorto ? mutual.MutualNombreCorto : mutual.MutualNombre) + " - " +
												mutual.PlanMutualNombre;
											}
										});
									}

								} else if (!scope.data.pacienteObtenido.Afiliaciones) {
									ret = "Mutual: Debe cargar la mutual del paciente";
								}
							}
						}
						return ret;
					}

					function clean() {

						// scope.data.pacienteObtenido = null;
						setModelDirective(null);
						scope.data.numeroDocumento = '';
						eliminarTelefonos();
						numeroDocumentoInput.focus();
					}

					/* ------------------------------------------- HELPERS ---------------------------------------------- */

					function objHasProperties(objectTo) {

						var ret = false;
						for (var prop in objectTo) {
							if (objectTo.hasOwnProperty(prop)) {
								ret = true;
							}
						}
						return ret;
					}

					function setearTelefonos() {
						eliminarTelefonos();

						if (scope.data.pacienteObtenido) {

							angular.forEach(scope.data.pacienteObtenido.Telefonos, function (telefono, key) {

								if (telefono.Defecto === true) {

									scope.data.numeroTelefonoPrincipal = telefono.TelefonoCompleto;
								} else scope.data.numeroTelefonoCelular = telefono.TelefonoCompleto;

							});
						} else {
							scope.data.numeroTelefonoPrincipal = '';
							scope.data.numeroTelefonoCelular = '';
						}
					}

					function eliminarTelefonos() {
						scope.data.numeroTelefonoPrincipal = '';
						scope.data.numeroTelefonoCelular = '';
					}

					function handleEventProp() {
						$('.dropdown-menu').click(function (e) {
							e.stopPropagation();
						});
					}

					scope.$watch(function () {
						return controller.$modelValue || controller.$viewValue;
					}, updateDirective);

					/// busco paciente por id function
					function buscarPacientePorId(idPaciente) {

						var def = $q.defer();
						var _paciente;

						PacienteDataService.obtenerPacientePorIdSelector(idPaciente)
							.then(function (pPaciente) {

								_paciente = pPaciente;
								def.resolve(_paciente);

							}, function (pError) {
								$log.error('obtenerPacientePorIdError', pError);
								def.reject(false);
							});

						return def.promise;;

					}


					/* ------------------------------------------- INICIO ---------------------------------------------- */



					SupportDataService.obtenerTodosTipoDocumento()
						.then(getAllTiposDocOk, getAllTiposDocError);

					function getAllTiposDocOk(pResults) {
						scope.data.tiposDocumento = pResults;
						$log.debug('getAllTiposDocOk', pResults);
					}

					function getAllTiposDocError(pError) {
						$log.error('getAllTiposDocError', pError);
					}

					getStoredData();

					$timeout(function () {

						numeroDocumentoInput.focus();
					}, 800);

					/* ---------------------------------------------- STORAGE ---------------------------------------------- */


					function getStoredData() {

						if (TurnosStorageHelperService.existStoredObjects(scope.storage.keyPacienteStorage)) {
							getData(TurnosStorageHelperService.getStorageObj(scope.storage.keyPacienteStorage));
						}

						function getData(stored) {

							var _paciente = stored.paciente ? angular.copy(stored.paciente) : {};
							$log.debug('getData storage', stored.paciente);
							if (_paciente.Id) {
								buscarPacientePorId(_paciente.Id)
									.then(function (pPaciente) {
										setModelDirective(pPaciente);
										cleanStorage();
									}, function (pError) {
										cleanStorage();
									});

							}
						}
					}

					function cleanStorage() {

						$log.debug('cleanStorage');
						TurnosStorageHelperService.cleanStorage(scope.storage.keyPacienteStorage);
					}

					function setStoredData() {

						var pacienteStorage = {
							paciente: scope.data.pacienteObtenido
						};
						TurnosStorageHelperService.setStorageObj(scope.storage.keyPacienteStorage, pacienteStorage);

					}

				}
			};
		}
	};

	return module;

})();