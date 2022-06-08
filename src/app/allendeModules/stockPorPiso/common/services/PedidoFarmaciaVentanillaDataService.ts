/**
* @author:         emansilla
* @description:    Datos de Pedidos de farmacia ventanilla
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IPedidoFarmaciaVentanillaDataService {
	getPedidosGuardiaBySucursal(idSucursal);
	newPedidoVentanillaGuardia(pObject);
	newPedidoVentanillaPiso(pObject);
	getPedidosPorUbicacion(idUbicacion);
	getPedidosDosificacionByUbicacionAndFechas(pObject);
	getPedidosDosificacionByInternacion(idInternacion);
	getPedidosDosificacionByInternacionAndFecha(pObject);
	getPedidosDosificacionByInternacionToday(idInternacion);
	getPedidosEntregadosByUbicacion(idUbicacion);
	getInternadosWithPedidosByUbicacion(idUbicacion);
	getDetallesByDosificacionesAndSucursal(idDosificacion, idSucursal);
	validarPedido(pedido);
}

class dataService implements IPedidoFarmaciaVentanillaDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('PedidoFarmaciaVentanillaDateService');
		this.$log.debug('ON');
	}

	public getPedidosGuardiaBySucursal(pSucursal) {
		var _url = 'PedidoFarmaciaVentanilla/GetPedidosGuardiaBySucursal/' + pSucursal;
		return this.DtoService.Get(_url);
	}

	public newPedidoVentanillaGuardia(pObject) {
		var _url = 'PedidoFarmaciaVentanilla/NewVentanillaGuardia/';
		return this.DtoService.Post(_url, pObject, {isDictionary: true});
	}

	public newPedidoVentanillaPiso(pObject) {
		var _url = 'PedidoFarmaciaVentanilla/NewVentanilla/';
		return this.DtoService.Post(_url, pObject, {isDictionary: true});
	}

	public getPedidosPorUbicacion(pUbicacion) {
		var _url = 'PedidoFarmaciaVentanilla/GetAllEntregadosByUbicacion/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	public getPedidosDosificacionByUbicacionAndFechas(pObject) {
		var _url = 'PedidoFarmaciaVentanilla/GetPedidosDosificacionByUbicacionAndFechas/';
		return this.DtoService.Post(_url, pObject, {isDictionary: true});
	}

	public getPedidosDosificacionByInternacion(pInternacion) {
		var _url = 'PedidoFarmaciaVentanilla/GetPedidosDosificacionByInternacion/' + pInternacion;
		return this.DtoService.Get(_url);
	}

	public getPedidosDosificacionByInternacionAndFecha(pObject) {
		var _url = 'PedidoFarmaciaVentanilla/GetPedidosDosificacionByInternacionAndFecha/';
		return this.DtoService.Post(_url, pObject, {isDictionary: true});
	}

	public getPedidosDosificacionByInternacionToday(pInternacion) {
		var _url = 'PedidoFarmaciaVentanilla/GetPedidosDosificacionByInternacionToday/' + pInternacion;
		return this.DtoService.Get(_url);
	}

	public getPedidosEntregadosByUbicacion(pUbicacion) {
		var _url = 'PedidoFarmaciaVentanilla/GetPedidosEntregadosByUbicacion/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	public getInternadosWithPedidosByUbicacion(pUbicacion) {
		var _url = 'PedidoFarmaciaVentanilla/GetInternadosWithPedidosByUbicacion/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	public getDetallesByDosificacionesAndSucursal(pIdDosificacion, pIdSucursal) {
		var _url = 'PedidoFarmaciaVentanilla/GetDetallesByDosificacionesAndSucursal/' + pIdDosificacion + '/' + pIdSucursal;
		return this.DtoService.Get(_url);
	}

	public validarPedido(_pedido) {
		// $log.debug("_pedido",_pedido);
		var _url = 'PedidoFarmaciaVentanilla/ValidarPedido/';
		return this.DtoService.Post(_url, _pedido);
	}

    /**
	 * Creación de data service
	 * @static
	 * @param log 
	 * @param dtoService 
	 */
	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class PedidoFarmaciaVentanillaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('PedidoFarmaciaVentanillaDataService', dataService.serviceFactory)
	}
}