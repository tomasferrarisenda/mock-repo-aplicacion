import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('AlertaNewController', AlertaNewController);

		// Inyección de Dependencia
		AlertaNewController.$inject = ['$log', '$q', '$scope', '$filter', '$uibModalInstance', 'moment', 'AlertaService',
			'AlertaDataService', 'UsuarioGestionDataService', 'Entidad'];

		// Constructor del Controller
		function AlertaNewController($log, $q, $scope, $filter, $uibModalInstance, moment, AlertaService,
			AlertaDataService, UsuarioGestionDataService, Entidad) {

			$log.debug('AlertaNewController: ON.-');

			var vm = this;

			vm.data = {
				tiposDestino: [],
				tiposOrigen: [],
				tiposCriticidad: [],
				tiposVisualizacion: [],
				tiposNotificacion: [],
				alertaDto: '',
				usuarios: [],
				usuariosRol: []
			};

			vm.formData = {
				destino: '',
				idTipoDestino: '',
				idDestino: '',
				esTipo: false,
				fechaDesde: '',
				fechaHasta: ''
			};

			vm.formControl = {
				// Manejo del formulario
				selectDestino: selectDestino,
				selectTipoOrigen: selectTipoOrigen,
				selectTipoAlerta: selectTipoAlerta,
				selectTipoNotificacion: selectTipoNotificacion,
				selectMarcarTodos: selectMarcarTodos,
				openCalendar: openCalendar,
				selectMarcar: selectMarcar,

				marcarTodos: false,
				hayTipoNotificacion: false,
				usuarios: false,
				hayDestino: false,
				error: true,
				loading: false,
				reloadPage: activate,
				cancel: volver,
				guardar: guardar
			};

			vm.filter = {
				usuario: '',
				esDeRol: '',
				usuarios: [],
				allUsuarios: []
			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};


			function cleanFilters() {
				vm.filter.usuario = '';
				vm.filter.esDeRol = '';
				vm.paginacion.currentPage = 1;
			}

			function validarFilters() {
				if (vm.filter.usuario == null || vm.filter.usuario == 0)
					vm.filter.usuario = "";

				if (vm.filter.esDeRol == null)
					vm.filter.esDeRol = "";
			}

			function getPage() {
				$log.debug('Get Page ON');
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				validarFilters();
				
				// vm.filter.allUsuarios = $filter('filter')
				// 	(vm.data.usuarios, {
				// 		Id: vm.filter.usuario,
				// 		esDeRol: vm.filter.esDeRol
				// 	});
				if (vm.filter.usuario == "") {
					vm.filter.allUsuarios = angular.copy(vm.data.usuarios);
				} else {
					vm.filter.allUsuarios = vm.data.usuarios.filter(x => x.Id === vm.filter.usuario)
				}

				if (vm.filter.esDeRol != "") {
					vm.filter.allUsuarios = vm.data.usuarios.filter(x => x.esDeRol === vm.filter.esDeRol);
				}

				$log.debug('filtro ', vm.filter.allUsuarios);
				vm.paginacion.totalItems = vm.filter.allUsuarios.length;
				vm.filter.usuarios = vm.filter.allUsuarios.slice(begin, end);
			}

			/* IMPLEMENTACIÓN*/

			function volver() {
				$uibModalInstance.close();
			}

			function selectDestino() {
				$log.debug('ng-change');
				cleanFilters();
				validarDestino();
				vm.formControl.marcarTodos = false;
				vm.formControl.usuarios = false;
				if (vm.formData.destino && vm.formData.destino !== '') {
					$log.debug('in 1If', vm.formData.destino);
					if (!vm.formData.destino.EsTipo) {
						$log.debug('in 2If', vm.formData.destino);
						switch (vm.formData.destino.Id) {
							case 1:
								// vm.formControl.usuarios=false;
								break;
						}
					}
					else {
						$log.debug('in 2else', vm.formData.destino);
						switch (vm.formData.destino.Id) {
							case 2:
								// vm.formControl.usuarios = true;
								getUsuariosPorRol();
								break;
							case 1:
								// vm.formControl.usuarios = true;
								vm.filter.usuario = vm.formData.idDestino;
								getPage();
								break;
						}
					}
				}
				else {
					$log.debug('in 1else', vm.formData.destino);
					getPage();
				}
				if (vm.formData.destino && vm.formData.destino.EsTipo) {
					vm.formControl.usuarios = true;
				}

			}

			function getUsuariosPorRol() {
				$log.debug('getUsuariosPorRol', vm.formData.idDestino);
				if (vm.formData.idDestino)
					UsuarioGestionDataService.obtenerUsuariosPorRol(vm.formData.idDestino)
						.then(function (_usuarios) {
							$log.debug('usuarios', _usuarios);
							for (var i = vm.data.usuarios.length - 1; i >= 0; i--) {
								vm.data.usuarios[i].esDeRol = '';
								for (var j = _usuarios.length - 1; j >= 0; j--) {
									if (_usuarios[j].Id == vm.data.usuarios[i].Id) {
										$log.debug('entra if', vm.data.usuarios[i]);
										vm.data.usuarios[i].esDeRol = 1;
									}
								}
							}
							vm.filter.esDeRol = 1;
							getPage();
						});
				else
					getPage();

			}

			function selectTipoNotificacion(pTipoNotificacion) {
				for (var i = vm.data.tiposNotificacion.length - 1; i >= 0; i--) {
					vm.data.tiposNotificacion[i].seleccionado = false;
					if (pTipoNotificacion.Id == vm.data.tiposNotificacion[i].Id) {
						vm.formData.tipoNotificacion = vm.data.tiposNotificacion[i];
						vm.data.tiposNotificacion[i].seleccionado = true;
						vm.formControl.hayTipoNotificacion = true;
					}
				}
			}

			function selectMarcarTodos() {
				for (var i = vm.filter.allUsuarios.length - 1; i >= 0; i--) {
					for (var j = vm.data.usuarios.length - 1; j >= 0; j--) {
						if (vm.data.usuarios[j].Id == vm.filter.allUsuarios[i].Id)
							vm.data.usuarios[j].cargado = vm.formControl.marcarTodos;
					}
				}
				getPage();
				validarDestino();
			}

			function selectMarcar(usuario) {

				for (var j = vm.data.usuarios.length - 1; j >= 0; j--) {
					if (vm.data.usuarios[j].Id == usuario.Id)
						vm.data.usuarios[j].cargado = usuario.cargado;
				}
				getPage();
				validarDestino();
			}

			function validarDestino() {
				vm.formControl.hayDestino = false;
				if (vm.formControl.usuarios) {
					var existe = false;
					for (var i = vm.data.usuarios.length - 1; i >= 0; i--) {
						if (vm.data.usuarios[i].cargado)
							existe = true;
					}
					if (existe)
						vm.formControl.hayDestino = true;
				}
				else {
					if (vm.formData.idDestino && vm.formData.idDestino !== '')
						vm.formControl.hayDestino = true;
				}
			}

			function openCalendar(e) {
				e.preventDefault();
				e.stopPropagation();

				vm.isOpen = true;
			}

			function selectTipoOrigen() {
				if (vm.formData.tipoOrigen)
					vm.data.tiposAlerta = vm.formData.tipoOrigen.TiposAlerta;
				else
					vm.data.tiposAlerta = '';
			}

			function selectTipoAlerta() {
				if (vm.formData.tipoAlerta) {
					if (vm.formData.tipoAlerta.Descripcion)
						vm.formData.descripcion = vm.formData.tipoAlerta.Descripcion;
					if (vm.formData.tipoAlerta.TipoCriticidad && vm.formData.tipoAlerta.TipoCriticidad.Id !== 0)
						vm.formData.tipoCriticidad = vm.formData.tipoAlerta.TipoCriticidad;
					if (vm.formData.tipoAlerta.TipoVisualizacion && vm.formData.tipoAlerta.TipoVisualizacion.Id !== 0)
						vm.formData.tipoVisualizacion = vm.formData.tipoAlerta.TipoVisualizacion;
					if (vm.formData.tipoAlerta.TipoNotificacion && vm.formData.tipoAlerta.TipoNotificacion.Id !== 0)
						selectTipoNotificacion(vm.formData.tipoAlerta.TipoNotificacion);
					if (vm.formData.tipoAlerta.TipoDestino && vm.formData.tipoAlerta.TipoDestino.Id !== 0) {
						vm.formData.destino = vm.formData.tipoAlerta.TipoDestino;
						// selectDestino();
					}
				}
				else
					vm.data.tipoAlerta = '';
			}

			$scope.$watch(function () {
				return vm.formData.fechaDesde;
			}, function (newValue) {
				$log.debug('vm.formData.fechaDesde', vm.formData.fechaDesde);
			});


			//Guardar
			function guardar() {

				var alerta = angular.copy(vm.data.alertaDto);
				alerta.Descripcion = vm.formData.descripcion;
				alerta.IdTipoEntidad = vm.formData.destino.Id;
				alerta.IdEntidad = vm.formData.idDestino;
				alerta.HayFechaHasta = false;
				$log.debug('fechaHasta', vm.formData.fechaHasta);
				if (vm.formData.fechaHasta && vm.formData.fechaHasta !== '') {
					alerta.HayFechaHasta = true;
					alerta.FechaHasta = moment(vm.formData.fechaHasta).format("MM-DD-YYYY HH:mm");
				}
				alerta.FechaDesde = moment(vm.formData.fechaDesde).format("MM-DD-YYYY HH:mm");
				alerta.IdTipoDeCriticidad = vm.formData.tipoCriticidad.Id;
				alerta.IdTipoOrigen = vm.formData.tipoOrigen.Id;
				alerta.IdTipoNotificacionAlerta = vm.formData.tipoNotificacion.Id;
				alerta.IdTipoVisualizacionAlerta = vm.formData.tipoVisualizacion.Id;
				alerta.IdTipoAlerta = (vm.formData.tipoAlerta) ? vm.formData.tipoAlerta.Id : 0;
				alerta.EsTipo = vm.formData.destino.EsTipo;
				if (alerta.EsTipo) {
					alerta.Usuarios = [];
					for (var i = vm.data.usuarios.length - 1; i >= 0; i--) {
						if (vm.data.usuarios[i].cargado)
							alerta.Usuarios.push(vm.data.usuarios[i].Id);
					}
				}

				$log.debug('guardarAlerta', alerta);
				AlertaDataService.NewAlerta(alerta)
					.then(function () {
						AlertaService.NewSuccess("Alerta generada correctamente");
						$uibModalInstance.close();
					});
			}


			$scope.$watch(function () {
				return vm.formData.destino;
			}, function (newValue, oldValue) {
				selectDestino();
			}, true);

			$scope.$watch(function () {
				return vm.formData.idDestino;
			}, function (newValue, oldValue) {
				selectDestino();
			}, true);

			activate();
			/* Método inicializador */
			function activate() {

				vm.formControl.loading = true;
				if (Entidad) {
					vm.formData.idTipoDestino = Entidad.idTipoEntidad;
					vm.formData.idDestino = Entidad.idEntidad;
					vm.formData.esTipo = Entidad.esDestinatario;
				}
				var tiposDestino = AlertaDataService.GetTiposDestino();
				var tiposOrigen = AlertaDataService.GetTiposOrigen();
				var tiposCriticidad = AlertaDataService.GetTiposCriticidad();
				var tiposVisualizacion = AlertaDataService.GetTiposVisualizacion();
				var tiposNotificacion = AlertaDataService.GetTiposNotificacion();
				var alertaDto = AlertaDataService.GetDtoNew();
				var usuarios = UsuarioGestionDataService.obtenerTodos();
				$q.all([tiposDestino, tiposOrigen, tiposCriticidad, tiposVisualizacion, tiposNotificacion, alertaDto, usuarios])
					.then(activateOk, function (pError) {
						$log.error('error activate',pError);
						vm.formControl.loading = false;
					});
			}

			function activateOk(results) {

				vm.data.tiposDestino = results[0];
				vm.data.tiposOrigen = results[1];
				vm.data.tiposCriticidad = results[2];
				vm.data.tiposVisualizacion = results[3];
				vm.data.tiposNotificacion = results[4];
				vm.data.alertaDto = results[5];
				vm.data.usuarios = results[6];

				for (var i = vm.data.usuarios.length - 1; i >= 0; i--) {
					vm.data.usuarios[i].esDeRol = 0;
				}

				vm.formControl.error = false;
				vm.formControl.loading = false;
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 10;
				cleanFilters();
				vm.paginacion.getPage();

				$log.debug('Inicializar OK', results);
			}
		}

	};
	return module;

})();