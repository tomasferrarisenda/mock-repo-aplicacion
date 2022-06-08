/**
 * @author:			Martin Astore
 * @description:	Alertas
 * @type:			Servicio de datos de alerta
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('AlertaDataService', AlertaDataService);
		AlertaDataService.$inject = [ 'Logger', '$rootScope', 'DotService'];
		function AlertaDataService ( $log, $rootScope, DotService) {
			
			$log = $log.getInstance('AlertaDataService');
			$log.debug('ON.-');
			
			this.alertasUsuario = [];
			this.alertasTitulo = [];
			this.timeout = 1800000; // 30 minutos
			// API o Interface
			const service = {
					AlertaLeida : AlertaLeida,
					AlertaNoLeida : AlertaNoLeida,
					GetAlertasUsuario : GetAlertasUsuario,
					GetAlertasDePaciente: GetAlertasDePaciente,
					GetAlertasByEntidad: GetAlertasByEntidad,
					GetTimeout: GetTimeout,
					// Alerta Module
					GetDtoFilters: GetDtoFilters,
					GetDtoNew : GetDtoNew,
					GetAlertasByFilters: GetAlertasByFilters,
					GetTiposDestino: GetTiposDestino,
					GetTiposOrigen: GetTiposOrigen,
					GetTiposAlerta: GetTiposAlerta,
					GetTiposCriticidad: GetTiposCriticidad,
					GetTiposVisualizacion: GetTiposVisualizacion,
					GetTiposNotificacion: GetTiposNotificacion,
					GetDestinatariosByAlerta: GetDestinatariosByAlerta,
					UpdateFecha: UpdateFecha,
					NewAlerta: NewAlerta
				};


				//Disparador de Alertas

				function AlertaLeida(Alerta) {
					this.update = false;
					// $log.debug('marcar leida',AlertaId);
					$rootScope.$broadcast('alertaLeida', Alerta);
					var alerta = {};
					$log.debug('this.alertasUsuario',this.alertasUsuario);
					$log.debug('this.alertasTitulo',this.alertasTitulo);
					// if(Alerta.esDeUsuario)
						for (var i = this.alertasUsuario.length - 1; i >= 0; i--) {
							if(this.alertasUsuario[i].toastId == Alerta.toastId && 
							this.alertasUsuario[i].body == Alerta.body )
								alerta = this.alertasUsuario[i];
						}
					// else if(!Alerta.esDeUsuario)
						for (var i = this.alertasTitulo.length - 1; i >= 0; i--) {
							if(this.alertasTitulo[i].toastId == Alerta.toastId && 
							this.alertasTitulo[i].body == Alerta.body )
								alerta = this.alertasTitulo[i];
						}
					var _url = 'Alerta/MarcarComoLeida';
					DotService.Post( _url,alerta);
					this.update = true;
				} 

				function AlertaNoLeida(Alerta) {
					this.update = false;
					$rootScope.$broadcast('alertaNoLeida', Alerta);

					var _url = 'Alerta/MarcarComoNoLeida';
					DotService.Post( _url, Alerta);
					this.update = true;
				}

				function GetAlertasUsuario() {
					var _url = 'Alerta/ObtenerPorUsuarioActual';
					return DotService.Get( _url);
				}

				function GetAlertasDePaciente(pIdPaciente) {
					var _url = 'Alerta/ObtenerPorEntidadAlertada/' + 1 + '/' + pIdPaciente;
					return DotService.Get( _url);
				}

				function GetAlertasByEntidad(entidades) {
					$log.debug('entidadesAlertar',entidades);
					var objeto= {
						Filtros: entidades
					};
					var _url = 'Alerta/GetByEntidades';
					return DotService.Post( _url, objeto);
				}

				function GetTimeout() {
					var _url = 'Alerta/ObtenerTimeout';
					return DotService.Get( _url);
				}



				//Modulo de Alertas
				

				function GetDtoFilters() {
					var _url = 'Alerta/GetDtoFiltros';
					return DotService.Get(_url);
				}

				function GetDtoNew() {
					var _url = 'Alerta/GetDtoNew';
					return DotService.Get(_url);
				}

				function GetAlertasByFilters(pAlerta) {
					var _url = 'Alerta/GetByFiltros';
					$log.debug('filtorAlerta',pAlerta);
					return DotService.Post( _url, pAlerta);
				}

				function GetTiposDestino() {
					var _url = 'Alerta/TiposDestino';
					return DotService.Get( _url);
				}

				function GetTiposOrigen() {
					var _url = 'Alerta/TiposOrigen';
					return DotService.Get( _url);
				}

				function GetTiposAlerta() {
					var _url = 'Alerta/TiposAlerta';
					return DotService.Get( _url);
				}

				function GetTiposCriticidad() {
					var _url = 'Alerta/TiposCriticidad';
					return DotService.Get( _url);
				}

				function GetTiposVisualizacion() {
					var _url = 'Alerta/TiposVisualizacion';
					return DotService.Get( _url);
				}
				
				function GetTiposNotificacion() {
					var _url = 'Alerta/TiposNotificacion';
					return DotService.Get( _url);
				}

				function GetDestinatariosByAlerta(idAlerta) {
					var _url = 'Alerta/ObtenerDestinatariosPorAlerta/' + idAlerta;
					return DotService.Get( _url);
				}

				function UpdateFecha(pAlerta) {
					var _url = 'Alerta/UpdateFecha';
					$log.debug('UpdateFecha',pAlerta);
					return DotService.Post( _url, pAlerta);
				}

				function NewAlerta(pAlerta) {
					var _url = 'Alerta/New';
					return DotService.Post( _url, pAlerta);
				}


				return service;
			}
	};

	return module;

})();