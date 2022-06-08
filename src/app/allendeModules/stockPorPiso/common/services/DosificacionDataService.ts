/**
* @author:         emansilla
* @description:    Data de dosificación
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IDosificacionDataService {
	guardarDosificacion(pObject);
	getTotalAEntregarPorInternado(idInternacion);
	getTotalDosificacionAEntregarPorInternado(idInternacion, idEstado);
	getDosificacionesDescartableByDosificacion(idDosificacion, idSucursal);
	devolucionToma(idToma, idSucursal);
	facturarToma(idToma, idSucursal);
	facturarDosificacion(idDosificacion, idSucursal);
	devolucionDosificacion(pIdDosificacion, pIdSucursal);
	cambiarProductoDosificacion(idDosificacion, idSucursal, numeroArticulo);
}

class dataService implements IDosificacionDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('DosificacionDateService');
		this.$log.debug('ON');
	}

	public guardarDosificacion(pObject) {
		var _url = 'DosificacionLegacy/GuardarDosificacion/';
		return this.DtoService.Post(_url, pObject, { isDictionary: true });
	}

	public getTotalAEntregarPorInternado(pInternacion) {
		var _url = 'DosificacionLegacy/GetAllEntregarByInternado/' + pInternacion;
		return this.DtoService.Get(_url);
	}

	public getTotalDosificacionAEntregarPorInternado(pInternacion, pEstado) {
		var _url = 'DosificacionLegacy/GetTotalAEntregarByInternado/' + pInternacion + "/" + pEstado;
		return this.DtoService.Get(_url);
	}

	public getDosificacionesDescartableByDosificacion(pDosificacion, pSucursal) {
		var _url = 'DosificacionLegacy/GetDosificacionesDescartableByDosificacion/' + pDosificacion + '/' + pSucursal;
		return this.DtoService.Get(_url);
	}

	public devolucionToma(pIdToma, pIdSucursal) {
		var _url = 'DosificacionLegacy/DevolucionToma/' + pIdToma + '/' + pIdSucursal;
		return this.DtoService.Get(_url);
	}

	public facturarToma(pIdToma, pIdSucursal) {
		var _url = 'DosificacionLegacy/FacturacionToma/' + pIdToma + '/' + pIdSucursal;
		return this.DtoService.Get(_url);
	}

	public facturarDosificacion(pIdDosificacion, pIdSucursal) {
		var _url = 'DosificacionLegacy/FacturacionDosificacion/' + pIdDosificacion + '/' + pIdSucursal;
		return this.DtoService.Get(_url);
	}

	public devolucionDosificacion(pIdDosificacion, pIdSucursal) {
		var _url = 'DosificacionLegacy/DevolucionDosificacion/' + pIdDosificacion + '/' + pIdSucursal;
		return this.DtoService.Get(_url);
	}

	public cambiarProductoDosificacion(idDosificacion, idSucursal, numeroArticulo) {
		var _url = 'DosificacionLegacy/CambiarProducto/' + idDosificacion + '/' + idSucursal + '/' + numeroArticulo;
		return this.DtoService.Get(_url);
	}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class DosificacionDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('DosificacionDataService', dataService.serviceFactory)
	}
}