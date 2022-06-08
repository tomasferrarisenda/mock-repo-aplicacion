/**
* @author:         emansilla
* @description:    Data de UbicacionDetalleStock
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IUbicacionDetalleStockDataService {
	actualizarUbicacionesDetalle(idUbicacion, idProducto, idUsuario?);
	deleteUbicacionDetalle(idUbicacion);
	actualizarUbicacionesDetalleMaxima(idUbicacion, idProducto)
}

class dataService implements IUbicacionDetalleStockDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('UbicacionDetalleStockDateService');
		this.$log.debug('ON');
	}

	// public cargarProducto(pDetalleUbicacion, pCantidad) {
	// 	var _url = 'UbicacionDetalleStock/AgregarStockByIdAndCantidad/' + pDetalleUbicacion + '/' + pCantidad;
	// 	return this.DtoService.Get( _url);
	// }
	
	public actualizarUbicacionesDetalle(pUbicacion, pProducto, pUsuario?) {
		var _url = 'UbicacionDetalleStock/UpdateByIdAndCantidadMinima/' + pUbicacion + '/' + pProducto + '/' + pUsuario;
		return this.DtoService.Get(_url);
	}

	public deleteUbicacionDetalle(pUbicacion) {
		var _url = 'UbicacionDetalleStock/DeleteById/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	public actualizarUbicacionesDetalleMaxima(pUbicacion, pProducto) {
		var _url = 'UbicacionDetalleStock/UpdateByIdAndCantidadMaxima/' + pUbicacion + '/' + pProducto;
		return this.DtoService.Get(_url);
	}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class UbicacionDetalleStockDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('UbicacionDetalleStockDataService', dataService.serviceFactory)
	}
}