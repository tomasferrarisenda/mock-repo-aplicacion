/**
* @author:         emansilla
* @description:    Data de pedidos farmacia
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IPedidoFarmaciaDataService {
	entregaGuardia(pedidos);
	getPedidosGuardiaByUbicacion(idUbicacion);
	getPedidosGuardiaByPrescripcion(idPrescripcion);
}

class dataService implements IPedidoFarmaciaDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('PedidoFarmaciaDateService');
		this.$log.debug('ON');
	}

	public entregaGuardia(pPedidos) {
		var _url = 'PedidoFarmacia/Entrega/';
		return this.DtoService.Post(_url, pPedidos);
	}

	public getPedidosGuardiaByUbicacion(pUbicacion) {
		var _url = 'PedidoFarmacia/GetPendientesByUbicacion/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	public getPedidosGuardiaByPrescripcion(idPrescripcion) {
		var _url = 'PedidoFarmacia/GetPendientesByPrescripcion/' + idPrescripcion;
		return this.DtoService.Get(_url);
	}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class PedidoFarmaciaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('PedidoFarmaciaDataService', dataService.serviceFactory)
	}
}