/**
 * @author:			Pedro Ferrer
 * @description:	DimensionableEditTplController
 * @type:			Controller
 **/
import * as angular from 'angular';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('DimensionableEditTplController', DimensionableEditTplController);

		DimensionableEditTplController.$inject = ['Logger', '$state', 'ModalService', 'condicion', '$q', 'ConvenioDataService', '$uibModalInstance', '$scope', 'OPERADOR_CONDICION', 'orderByFilter', '$filter', 'idFinanciador', 'tipoValorConsecuencia', 'CONSECUENCIA_VALOR'];

		function DimensionableEditTplController($log, $state, ModalService, condicion, $q, ConvenioDataService, $uibModalInstance, $scope, OPERADOR_CONDICION, orderByFilter, $filter, idFinanciador, tipoValorConsecuencia, CONSECUENCIA_VALOR) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('DimensionableEditTplController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.OPERADOR_CONDICION = OPERADOR_CONDICION;

			vm.title = {
				name: '',
				icon: '',
				tituloDimension: condicion.NombreDimension
			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.data = {
				elementos: null,
				condicion: condicion,
				valorDto: null
			};

			vm.filter = {
				codigo: '',
				nombre: '',
				elementos: '',
				soloSeleccionados: false
			};

			vm.formControl = {
				cancel: cancel,
				guardar: guardar,
				elementoSeleccion: elementoSeleccion,
				elementoSeleccionDentro: elementoSeleccionDentro
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function cancel() {
				$uibModalInstance.dismiss('close');
			}

			function guardar() {
				//DENTRO DE O NO DENTRO DE
				switch (vm.data.condicion.IdOperador) {
					case OPERADOR_CONDICION.DENTRO_DE:
					case OPERADOR_CONDICION.NO_DENTRO_DE:
						if (!vm.data.condicion.Valores) {
							//Primer elemento en la lista
							vm.data.condicion.Valores = [];
							for (var j = 0; j < vm.data.elementos.length; j++) {
								if (vm.data.elementos[j].Seleccionado) {
									var nuevoValorDto = angular.copy(vm.data.valorDto)
									completarValorDto(nuevoValorDto, vm.data.elementos[j]);
									vm.data.condicion.Valores.push(nuevoValorDto);
								}
							}
						}
						else {
							var elementoExiste;
							for (var j = 0; j < vm.data.elementos.length; j++) {
								elementoExiste = false;
								for (var i = 0; i < vm.data.condicion.Valores.length; i++) {
									if (vm.data.condicion.Valores[i].IdValor === vm.data.elementos[j].Id) {
										elementoExiste = true;
										if (vm.data.elementos[j].Seleccionado) {
											var nuevoValorDto = angular.copy(vm.data.valorDto)
											completarValorDto(nuevoValorDto, vm.data.elementos[j]);
											nuevoValorDto.Id = vm.data.condicion.Valores[i].Id;
											vm.data.condicion.Valores[i] = nuevoValorDto;
										}
										else {
											vm.data.condicion.Valores.splice(i, 1);
											i = i - 1;
										}
										break;
									}
								}
								if (!elementoExiste && vm.data.elementos[j].Seleccionado) {
									var nuevoValorDto = angular.copy(vm.data.valorDto)
									completarValorDto(nuevoValorDto, vm.data.elementos[j]);
									vm.data.condicion.Valores.push(nuevoValorDto); // Me duele la cabeza
								}
							}
						}
						break;
					case OPERADOR_CONDICION.IGUAL:
					case OPERADOR_CONDICION.DISTINTO:
						for (var j = 0; j < vm.data.elementos.length; j++) {
							if (vm.data.elementos[j].Seleccionado) {
								var nuevoValorDto = angular.copy(vm.data.valorDto)
								completarValorDto(nuevoValorDto, vm.data.elementos[j]);
								nuevoValorDto.Id = vm.data.condicion.Valores && vm.data.condicion.Valores[0] ? vm.data.condicion.Valores[0].Id : 0;
								vm.data.condicion.Valores = [];
								vm.data.condicion.Valores.push(nuevoValorDto);
								break;
							}
						}
						break;
					case OPERADOR_CONDICION.ENTRE:
					case OPERADOR_CONDICION.NO_ENTRE:
						for (var j = 0; j < vm.data.elementos.length; j++) {
							if (vm.data.elementos[j].Seleccionado) {
								var nuevoValorDto = angular.copy(vm.data.valorDto)
								completarValorDto(nuevoValorDto, vm.data.elementos[j]);
								if (tipoValorConsecuencia === CONSECUENCIA_VALOR.VALOR_DESDE) {
									nuevoValorDto.Id = vm.data.condicion.Valores && vm.data.condicion.Valores[0] ? vm.data.condicion.Valores[0].Id : 0;
									vm.data.condicion.Valores[0] = nuevoValorDto;
								}
								if (tipoValorConsecuencia === CONSECUENCIA_VALOR.VALOR_HASTA) {
									nuevoValorDto.Id = vm.data.condicion.Valores && vm.data.condicion.Valores[1] ? vm.data.condicion.Valores[1].Id : 0;
									vm.data.condicion.Valores[1] = nuevoValorDto;
								}
								break;
							}
						}
						break;
					default:
						break;
				}

				ConvenioDataService.ObtenerCondicionConValoresFormateados(vm.data.condicion)
					.then(function (condicionFormateada) {
						$uibModalInstance.close(condicionFormateada);
					});
			}

			function completarValorDto(nuevoValorDto, elemento) {
				nuevoValorDto.IdValor = elemento.Id;
				nuevoValorDto.Nombre = elemento.Nombre;
			}

			function elementoSeleccion(elemento, vieneDeDobleClick) {
				vm.data.elementos.forEach(element => {
					element.Seleccionado = false;
				});
				elemento.Seleccionado = true;
				if (vieneDeDobleClick) {
					guardar();
				}
			}

			function elementoSeleccionDentro(elemento) {
				elemento.Seleccionado = !elemento.Seleccionado;
			}

			function getPage() {
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				validar();
				if (!vm.filter.soloSeleccionados) {
					vm.filter.elementos = $filter('filter')
						(vm.data.elementos, {
							Codigo: vm.filter.codigo,
							Nombre: vm.filter.nombre
						});
				}
				else {
					vm.filter.elementos = $filter('filter')
						(vm.data.elementos, {
							Codigo: vm.filter.codigo,
							Nombre: vm.filter.nombre,
							Seleccionado: vm.filter.soloSeleccionados
						});
				}
				vm.paginacion.totalItems = vm.filter.elementos.length;
				vm.filter.elementos = vm.filter.elementos.slice(begin, end);
			}

			function validar() {
				vm.filter.codigo = vm.filter.codigo === null ? '' : vm.filter.codigo;
				vm.filter.nombre = vm.filter.nombre === null ? '' : vm.filter.nombre;
			}
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {
				vm.title.name = 'Seleccionar ' + vm.title.tituloDimension;
				vm.title.icon = condicion === null ? 'NEW2' : 'EDIT';
				vm.data.condicion = condicion;

				obtenerElementos().then(function (elementos) {
					vm.data.elementos = elementos;

					if (condicion.Valores) { // Recorrido anidado... horrible
						switch (tipoValorConsecuencia) {
							case CONSECUENCIA_VALOR.VALOR_IGUAL:
								for (var i = 0; i < condicion.Valores.length; i++) {
									for (var j = 0; j < vm.data.elementos.length; j++) {
										if (condicion.Valores[i].IdValor == vm.data.elementos[j].Id) {
											vm.data.elementos[j].Seleccionado = true;
											break;
										}
									}
								}
								break;
							case CONSECUENCIA_VALOR.VALOR_DESDE:
								for (var j = 0; j < vm.data.elementos.length; j++) {
									if (condicion.Valores[0].IdValor == vm.data.elementos[j].Id) {
										vm.data.elementos[j].Seleccionado = true;
										break;
									}
								}
								break;
							case CONSECUENCIA_VALOR.VALOR_HASTA:
								for (var j = 0; j < vm.data.elementos.length; j++) {
									if (condicion.Valores[1].IdValor == vm.data.elementos[j].Id) {
										vm.data.elementos[j].Seleccionado = true;
										break;
									}
								}
								break;
							default:
								break;
						}
					}

					vm.formControl.error = false;
					vm.formControl.loading = false;
					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 10;
					getPage();
				});

				ConvenioDataService.ObtenerNuevoValorCondicionEditDto().then(function (valorDto) {
					vm.data.valorDto = valorDto;
				});
			}

			function obtenerElementos() {
				var def = $q.defer();
				ConvenioDataService.ObtenerDimensionablesPorTipo(condicion.IdDimension, idFinanciador)
					.then(function (elementos) {
						def.resolve(elementos);
					});
				return def.promise;
			}
		}
	};

	return module;
})();