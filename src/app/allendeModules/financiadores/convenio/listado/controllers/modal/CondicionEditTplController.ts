/**
 * @author:			Pedro Ferrer
 * @description:	CondicionEditTpl
 * @type:			Controller
 **/
import * as angular from 'angular';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('CondicionEditTplController', CondicionEditTplController);

		CondicionEditTplController.$inject = ['Logger', '$state', 'ModalService', 'condicionEditDto', '$q', 
		'ConvenioDataService', '$uibModalInstance', 'OPERADOR_CONDICION', '$scope', 
		'ConvenioLogicService', 'CONSECUENCIA_VALOR', 'idFinanciador', 'idConvenio'];

		function CondicionEditTplController($log, $state, ModalService, condicionEditDto, $q, 
			ConvenioDataService, $uibModalInstance, OPERADOR_CONDICION, $scope, 
			ConvenioLogicService, CONSECUENCIA_VALOR, idFinanciador, idConvenio) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CondicionEditTplController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.CONSECUENCIA_VALOR = CONSECUENCIA_VALOR;

			vm.title = {
				name: '',
				icon: ''
			};

			vm.data = {
				dimensiones: '',
				condicionEdit: '',
				esEntre: false
			};

			vm.filter = {
				dimensionElegida: {},
				operadorElegido: {},
				valoresFormateados: '',
				desde: null,
				hasta: null
			};

			vm.formControl = {
				volver: volver,
				cancel: cancel,
				guardar: guardar,
				buscar: buscar,
				cambiarOperador: cambiarOperador,
				cambiarDimension: cambiarDimension
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function volver() {
				$state.go('home');
			}

			function cancel() {
				$uibModalInstance.dismiss('close');
			}

			function guardar() {
				asignarValoresADto();
				$uibModalInstance.close(vm.data.condicionEdit);
			}

			function buscar(tipoValorConsecuencia) {
				asignarValoresADto();

				switch (vm.data.condicionEdit.IdOperador) {
					case OPERADOR_CONDICION.IGUAL:
					case OPERADOR_CONDICION.DISTINTO:
					case OPERADOR_CONDICION.DENTRO_DE:
					case OPERADOR_CONDICION.NO_DENTRO_DE:
					case OPERADOR_CONDICION.ENTRE:
					case OPERADOR_CONDICION.NO_ENTRE:
						ConvenioLogicService.editarDimensionable(vm.data.condicionEdit, idFinanciador, tipoValorConsecuencia).then(function (condicion) {
							vm.data.condicionEdit = condicion;
							switch (tipoValorConsecuencia) {
								case CONSECUENCIA_VALOR.VALOR_IGUAL:
									vm.filter.valoresFormateados = vm.data.condicionEdit.ValoresFormateados;
									break;
								case CONSECUENCIA_VALOR.VALOR_DESDE:
									vm.filter.desde = vm.data.condicionEdit.ValoresFormateados.split(" y ")[0];
									break;
								case CONSECUENCIA_VALOR.VALOR_HASTA:
									vm.filter.hasta = vm.data.condicionEdit.ValoresFormateados.split(" y ")[1];
									break;
								default:
									break;
							}
						})
						break;
					case OPERADOR_CONDICION.DENTRO_DE_LISTA:
					case OPERADOR_CONDICION.NO_DENTRO_DE_LISTA:
						ConvenioLogicService.editarListaFacturacionDimensionable(vm.data.condicionEdit, idFinanciador, idConvenio,
								vm.filter.dimensionElegida.Id).then(function (condicion) {
							vm.data.condicionEdit = condicion;
							vm.filter.valoresFormateados = vm.data.condicionEdit.ValoresFormateados;
						})
				}
			}

			function borrarValores() {
				vm.data.condicionEdit.ValoresFormateados = null;
				vm.data.condicionEdit.Valores = null;
				vm.filter.valoresFormateados = null;
				vm.filter.desde = null;
				vm.filter.hasta = null;
			}

			function asignarValoresADto() {
				vm.data.condicionEdit.IdDimension = vm.filter.dimensionElegida.Id;
				vm.data.condicionEdit.NombreDimension = vm.filter.dimensionElegida.Nombre;
				vm.data.condicionEdit.IdOperador = vm.filter.operadorElegido.Id;
				vm.data.condicionEdit.NombreOperador = vm.filter.operadorElegido.Nombre;
			}

			function cambiarDimension() {
				vm.filter.operadorElegido = vm.filter.dimensionElegida.OperadoresHabilitados[0];
				cambiarOperador(vm.filter.operadorElegido);
				// borrarValores();
			}

			function cambiarOperador(operador) {
				if (operador) {
					vm.data.esEntre = operador.Id == OPERADOR_CONDICION.ENTRE || operador.Id == OPERADOR_CONDICION.NO_ENTRE;
					switch (operador.Id) {
						case OPERADOR_CONDICION.IGUAL:
						case OPERADOR_CONDICION.DISTINTO:
							if (vm.data.condicionEdit.IdOperador != OPERADOR_CONDICION.IGUAL && vm.data.condicionEdit.IdOperador != OPERADOR_CONDICION.DISTINTO)
								borrarValores();
							break;
						case OPERADOR_CONDICION.DENTRO_DE:
						case OPERADOR_CONDICION.NO_DENTRO_DE:
							if (vm.data.condicionEdit.IdOperador != OPERADOR_CONDICION.DENTRO_DE && vm.data.condicionEdit.IdOperador != OPERADOR_CONDICION.NO_DENTRO_DE)
								borrarValores();
							break;
						case OPERADOR_CONDICION.ENTRE:
						case OPERADOR_CONDICION.NO_ENTRE:
							// if (vm.data.condicionEdit.IdOperador != OPERADOR_CONDICION.ENTRE && vm.data.condicionEdit.IdOperador != OPERADOR_CONDICION.NO_ENTRE)
								borrarValores();
							ConvenioDataService.ObtenerNuevoValorCondicionEditDto().then(function (valorDto) {
								var nuevoValorDtoDesde = angular.copy(valorDto);
								var nuevoValorDtoHasta = angular.copy(valorDto);
								vm.data.condicionEdit.Valores = [];
								vm.data.condicionEdit.Valores.push(nuevoValorDtoDesde, nuevoValorDtoHasta);
							});
							break;
						case OPERADOR_CONDICION.DENTRO_DE_LISTA:
						case OPERADOR_CONDICION.NO_DENTRO_DE_LISTA:
							if (vm.data.condicionEdit.IdOperador != OPERADOR_CONDICION.DENTRO_DE_LISTA && vm.data.condicionEdit.IdOperador != OPERADOR_CONDICION.NO_DENTRO_DE_LISTA)
								borrarValores();
							break;
						default:
							break;
					}
				}
				else {
					borrarValores();
				}
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {
				vm.title.name = condicionEditDto === null ? 'Nueva condición' : 'Editar condición #' + condicionEditDto.Id;
				vm.title.icon = condicionEditDto === null ? 'NEW2' : 'EDIT';

				obtenerCondicionDto().then(function (condicion) {
					vm.data.condicionEdit = condicion;

					ConvenioDataService.ObtenerDimensiones()
						.then(function (dimensiones) {
							vm.data.dimensiones = dimensiones;

							if (vm.data.condicionEdit.IdDimension > 0) {
								//Asigno la dimension que tiene la condicion
								for (let i = 0; i < vm.data.dimensiones.length; i++) {
									if (vm.data.dimensiones[i].Id === vm.data.condicionEdit.IdDimension) {
										vm.filter.dimensionElegida = vm.data.dimensiones[i];

										//Asigno el operador que tiene la condicion
										for (let j = 0; j < vm.filter.dimensionElegida.OperadoresHabilitados.length; j++) {
											if (vm.filter.dimensionElegida.OperadoresHabilitados[j].Id === vm.data.condicionEdit.IdOperador) {
												vm.filter.operadorElegido = vm.filter.dimensionElegida.OperadoresHabilitados[j];

												//Formateo para poner el "y" entre valores y que quede mas bonito para el usuario... :<
												if (vm.filter.operadorElegido.Id == OPERADOR_CONDICION.ENTRE || vm.filter.operadorElegido.Id == OPERADOR_CONDICION.NO_ENTRE) {
													vm.data.esEntre = true;
													vm.filter.desde = vm.data.condicionEdit.ValoresFormateados.split(" y ")[0];
													vm.filter.hasta = vm.data.condicionEdit.ValoresFormateados.split(" y ")[1];
												}
												else {
													vm.filter.valoresFormateados = vm.data.condicionEdit.ValoresFormateados;
												}
												break;
											}
										}
										break;
									}
								}
							} else {
								vm.filter.dimensionElegida = vm.data.dimensiones[0];
								vm.filter.operadorElegido = vm.filter.dimensionElegida.OperadoresHabilitados[0];
							}
						});
				});
			}

			function obtenerCondicionDto() {
				var def = $q.defer();
				if (condicionEditDto) {
					def.resolve(angular.copy(condicionEditDto));
				}
				else {
					ConvenioDataService.ObtenerNuevaCondicionParaEdicion()
						.then(function (condicion) {
							def.resolve(condicion);
						});
				}
				return def.promise;
			}
		}
	};

	return module;
})();