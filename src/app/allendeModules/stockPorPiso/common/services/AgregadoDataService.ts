/**
* @author:         emansilla
* @description:    Data de Agregado
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IAgregadoDataService {
	getInfusionesByInternacion(idInternacion);
	getInfusionesByInternacionToday(idInternacion);
	getEstadoInfusion();
	guardarInfusion(pObject);
	getTotalAgregadosAEntregarPorInternacion(idInternacion, idEstado);
	devolucionAgregado(idAgregado, idSucursal);
	facturarAgregado(idAgregado, idSucursal);
	cambiarProductoAgregado(idAgregado, idSucursal, numeroArticulo);
}

class dataService implements IAgregadoDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('AgregadoDateService');
		this.$log.debug('ON');
	}

	public getInfusionesByInternacion(pInternacion) {
		var _url = 'AgregadoLegacy/GetInfusionesByNumeroInternado/' + pInternacion;
		return this.DtoService.Get(_url);
	}

	public getInfusionesByInternacionToday(pInternacion) {
		var _url = 'AgregadoLegacy/GetInfusionesByNumeroInternadoToday/' + pInternacion;
		return this.DtoService.Get(_url);
	}

	public getEstadoInfusion() {
		var _url = 'AgregadoLegacy/GetEstadoInfusion';
		return this.DtoService.Get(_url);
	}

	public guardarInfusion(pObject) {
		var _url = 'AgregadoLegacy/GuardarInfusion/';
		return this.DtoService.Post(_url, pObject, { isDictionary: true });
	}

	public getTotalAgregadosAEntregarPorInternacion(pInternacion, pEstado) {
		var _url = 'AgregadoLegacy/GetTotalAEntregarByInternado/' + pInternacion + "/" + pEstado;
		return this.DtoService.Get(_url);
	}

	public devolucionAgregado(pIdAgregado, pIdSucursal) {
		var _url = 'AgregadoLegacy/Devolucion/' + pIdAgregado + '/' + pIdSucursal;
		return this.DtoService.Get(_url);
	}

	public facturarAgregado(pIdAgregado, pIdSucursal) {
		var _url = 'AgregadoLegacy/Facturacion/' + pIdAgregado + '/' + pIdSucursal;
		return this.DtoService.Get(_url);
	}

	public cambiarProductoAgregado(idAgregado, idSucursal, numeroArticulo) {
		var _url = 'AgregadoLegacy/CambiarProducto/' + idAgregado + '/' + idSucursal + '/' + numeroArticulo;
		return this.DtoService.Get(_url);
	}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class AgregadoDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('AgregadoDataService', dataService.serviceFactory)
	}
}