/**
 * @author 			mastore
 * @description 	Servicio de alertas
 */
class AlertaService implements IAlertaService {
	private _fecha = new Date();

	constructor(private $log, private DEBUG, private AlertaDataService, private StorageService, private $interval, private $window) {
		AlertaDataService.alertas = [];
		AlertaDataService.alertasUsuario = [];
		AlertaDataService.alertasTitulo = [];
		AlertaDataService.pop = false;
		AlertaDataService.close = false;

		this.$log = $log.getInstance('AlertaService');
		this.$log.debug('ON.-');
	}

	public OnLogin() {
		var vm = this;
		vm.$interval.cancel(vm.AlertaDataService.interval);
		//vm.$log.debug('AlertaService OnLogin - GetTimeout');
		//vm.GetTimeout();
		vm.AlertaDataService.GetAlertasUsuario()
			.then(function (_alertas) {
				vm.$log.debug('_alertasUsuario', _alertas);
				vm.StorageService.removeItem('sa-alertas-activas');
				vm.AlertaDataService.alertasUsuario = [];
				vm.Pop(_alertas);
			});
	}

	public GetTimeout() {
		let vm = this;
		//voy a ver las alertas
		this.OnLogin();
		//vm.$log.debug('AlertaService OnLogin - vm.AlertaDataService.GetTimeout');
		vm.AlertaDataService.GetTimeout()
			.then(function (timeout) {
				vm.AlertaDataService.timeout = timeout;
				vm.$log.debug('timeout', vm.AlertaDataService.timeout);
				vm.ActualizarAlertas();
			});
	}

	public ActualizarAlertas() {
		let vm = this;
		vm.AlertaDataService.interval =
			vm.$interval(function () {
				var existe = false;
				var alertasNuevas: Array<any> = [];
				vm.AlertaDataService.GetAlertasUsuario()					
					.then(function (_alertas) {
						vm.$log.debug('ActualizarAlertas - GetAlertasUsuario');
						for (var i = _alertas.length - 1; i >= 0; i--) {
							existe = false;
							for (var j = vm.AlertaDataService.alertasUsuario.length - 1; j >= 0; j--) {
								if (vm.AlertaDataService.alertasUsuario[j].toastId == _alertas[i].toastId) {
									// this.AlertaDataService.alertasUsuario[j] = _alertas[i];
									existe = true;
								}
							}
							if (!existe) {
								alertasNuevas.unshift(_alertas[i]);
							}
						}
						vm.Pop(alertasNuevas);
					});
			}, vm.AlertaDataService.timeout);
	}

	public GetAlertasDePaciente(pIdPaciente) {
		let vm = this;
		vm.DeleteAlertasByTipoEntidad(1);
		vm.AlertaDataService.GetAlertasDePaciente(pIdPaciente)
			.then(function (_alertas) {
				vm.$log.debug('_alertasPaciente', _alertas);
				vm.Pop(_alertas);
				for (var i = _alertas.length - 1; i >= 0; i--) {
					if (_alertas[i].criticidad == "Critica") return false;
				}
				return true;
			});
	}

	public DeleteAlertasByTipoEntidad(pIdTipoEntidad) {
		let vm = this;
		vm.CloseAll();
		vm.$log.debug('allalertasantes', vm.AlertaDataService.alertasTitulo);
		for (var i = vm.AlertaDataService.alertasTitulo.length - 1; i >= 0; i--) {
			if (vm.AlertaDataService.alertasTitulo[i].idTipoEntidadAlertada == pIdTipoEntidad)
				vm.AlertaDataService.alertasTitulo.splice(i, 1);
		}
		vm.$log.debug('allalertasdesp', vm.AlertaDataService.alertasTitulo);
	}

	public AddToAlertasUsuario(pAlerta) {
		let vm = this;
		if (pAlerta.esDeUsuario) {
			var existe = false;
			for (var i = vm.AlertaDataService.alertasUsuario.length - 1; i >= 0; i--) {
				if (vm.AlertaDataService.alertasUsuario[i].toastId == pAlerta.toastId &&
					vm.AlertaDataService.alertasUsuario[i].body == pAlerta.body) {
					existe = true;
					vm.AlertaDataService.alertasUsuario[i].leido = pAlerta.leido;
				}
			}
			if (!existe && pAlerta.toasterId == 1) vm.AlertaDataService.alertasUsuario.unshift(pAlerta);
			vm.StorageService.set('sa-alertas-activas', vm.AlertaDataService.alertasUsuario);
		}
	}

	public AddToAlertasTitulo(pAlerta) {
		let vm = this;
		if (!pAlerta.esDeUsuario) {
			var existe = false;
			for (var i = vm.AlertaDataService.alertasTitulo.length - 1; i >= 0; i--) {
				if (vm.AlertaDataService.alertasTitulo[i].toastId == pAlerta.toastId &&
					vm.AlertaDataService.alertasTitulo[i].body == pAlerta.body) {
					existe = true;
					vm.AlertaDataService.alertasTitulo[i].leido = pAlerta.leido;
				}
			}
			if (!existe && pAlerta.toasterId == 1) vm.AlertaDataService.alertasTitulo.unshift(pAlerta);
		}
	}

	public Add(pAlerta) {
		let vm = this;
		if (pAlerta.toasterId == 1) {
			pAlerta.clickHandler = function (toast, isclose) {
				var match = toast.body.match(/http[s]?:\/\/[^\s]+/);
				vm.$log.debug('match', match);
				if (match) vm.$window.open(match[0]);

				vm.$log.debug('clickHandler', toast, isclose);
				vm.AlertaDataService.AlertaLeida(toast);
				return true;
			};
		}		
		vm.AddToAlertasUsuario(pAlerta);
		vm.AddToAlertasTitulo(pAlerta);
		vm.AlertaDataService.alertas.unshift(pAlerta);
		vm.AlertaDataService.pop = true;
	}

	public NewPrueba(pTitle) {
		let vm = this;
		var _alerta = {
			toastId: "1",
			type: 'prueba',
			title: pTitle,
			body: "Descripcion de Prueba",
			fecha: vm._fecha,
			timeout: 0,
			showCloseButton: true,
			tapToDismiss: true,
			toasterId: 1,
			leido: false,
			color: 'toast-prueba',
			clickHandler: function (toast, isclose) {
				vm.$log.debug('clickHandler', toast, isclose);

				var match = toast.body.match(/http[s]?:\/\/[^\s]+/);
				vm.$log.debug('match', match);
				if (match) vm.$window.open(match[0]);

				vm.AlertaDataService.AlertaLeida(toast);
				return true;
			}
		};
		vm.$log.debug('_Alerta', _alerta);
		vm.Add(_alerta);
	}

	public NewWarning(pTitle, pBody?, onClick?: Function) {
		let vm = this;
		var _alerta = {
			type: 'warning',
			title: pTitle,
			body: pBody,
			timeout: 3000,
			showCloseButton: true,
			tapToDismiss: true,
			toasterId: 2,
			clickHandler: function (toast, isclose) {
				if (onClick && !isclose) {
					onClick.call(undefined);
				}
				return true;
			}
		};
		vm.Add(_alerta);
	}

	public NewError(pTitle, pBody) {
		let vm = this;
		var _alerta = {
			type: 'error',
			title: pTitle,
			body: pBody,
			timeout: (this.DEBUG) ? 2000 : 0,
			showCloseButton: true,
			tapToDismiss: this.DEBUG,
			toasterId: 2
		};
		vm.Add(_alerta);
	}

	public NewInfo(pTitle, pBody) {
		let vm = this;
		var _alerta = {
			type: 'info',
			title: pTitle,
			body: pBody,
			timeout: 5000,
			showCloseButton: false,
			tapToDismiss: true,
			toasterId: 2
		};
		vm.Add(_alerta);
	}

	public NewSuccess(pTitle, pBody) {
		let vm = this;
		var _alerta = {
			type: 'success',
			title: pTitle,
			body: pBody,
			timeout: 3000,
			showCloseButton: false,
			tapToDismiss: true,
			toasterId: 2
		};
		vm.Add(_alerta);
	}

	public Pop(pAlertas) {
		let vm = this;
		if (!vm.AlertaDataService.alertasUsuario)
			vm.AlertaDataService.alertasUsuario = [];
		if (!vm.AlertaDataService.alertas)
			vm.AlertaDataService.alertas = [];
		for (var i = pAlertas.length - 1; i >= 0; i--) {
			pAlertas[i].clickHandler = clickHandlerToast;
		}
		vm.AlertaDataService.alertas = pAlertas;
		vm.AlertaDataService.pop = true;

		for (var i = pAlertas.length - 1; i >= 0; i--) {
			vm.AddToAlertasUsuario(pAlertas[i]);
			vm.AddToAlertasTitulo(pAlertas[i]);
		}

		function clickHandlerToast(toast, isclose) {
			vm.$log.debug('clickHandler', toast, isclose);
			var match = toast.body.match(/http[s]?:\/\/[^\s]+/);
			vm.$log.debug('match', match);
			if (match) vm.$window.open(match[0]);
			
			vm.AlertaDataService.AlertaLeida(toast);
			return true;
		}

	}

	public CloseAll() {
		this.AlertaDataService.close = true;
	}

	public GetAlertasByEntidad(entidades) {
		let vm = this;
		for (var i = entidades.length - 1; i >= 0; i--) {
			vm.DeleteAlertasByTipoEntidad(entidades[i].IdTipoEntidad);
		}
		vm.AlertaDataService.GetAlertasByEntidad(entidades)
			.then(function (_alertas) {
				vm.$log.debug('_alertasEntidad', _alertas);
				vm.Pop(_alertas);
				// for (var i = _alertas.length - 1; i >= 0; i--) {
				// 	if(_alertas[i].criticidad == "Critica") return false;
				// }
				// return true;
			});
	}
	
	static serviceFactory($log, DEBUG, AlertaDataService, StorageService, $interval, $window) {
		return new AlertaService($log, DEBUG, AlertaDataService, StorageService, $interval, $window);
	}

}
AlertaService.serviceFactory.$inject = ['Logger', 'DEBUG', 'AlertaDataService', 'StorageService', '$interval', '$window'];
export default class {
	public static init(ngModule: angular.IModule) {
		ngModule.factory('AlertaService', AlertaService.serviceFactory);
	}
}