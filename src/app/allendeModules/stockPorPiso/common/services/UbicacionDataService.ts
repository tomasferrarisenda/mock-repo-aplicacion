/**
* @author:         emansilla
* @description:    Datos de Ubicacion 
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IUbicacionDataService {
	getUbicacionById(idUbicacion);
	getAllMaterialesByUbicacion(idUbicacion);
	getUbicacionesDetalleByUbicacionAndTipo(idUbicacion, idTipo);
	getUbicacionesDetallePedidoByUbicacion(idUbicacion);
	getInternacionesPorUbicacion(idUbicacion);
	getInternacionesPorUbicacionOnly(idUbicacion, idDosificaciones);
	getAllInternacionesBySucursal(idSucursal);
	getAllMovimientoByUbicacion(idUbicacion);
	getAllMovimientoByUbicacionAndFechas(pObject);
	getTotalNoRepuestoByUbicacionAndTipo(idUbicacion, idTipo);
	getTotalNoRepuestoByUbicacionAndInternacionAndTipo(idUbicacion, idInternacion, idTipo);
	getTotalNoRepuestoVentanillaByUbicacion(idUbicacion);
	getNoRepuestoVentanillaByUbicacionAndInternado(idUbicacion, idInternacion);
	getUsuariosDesdeByIdUbicacion(idUbicacion);
	nuevoDetalleUbicacionByUbicacionYMaterialYTipo(idUbicacion, idMaterial, idTipo);
	getUbicacionPorNumeroInternado(numeroInternado);
	getInternadoByIdUbicacion(pUbicacion);
	getInternacionesPendientesReposicionByUbicacion(idUbicacion);
	getUbicacionGuardiaBySucursal(idSucursal);
	getInformeByUbicacionAndFechas(pObject);
	getInternadosByUbicacionInternado(pUbicaciones);
	checkCantidades(pObject);
	getQuirofanoBySucursal(idSucursal: number);
}

class dataService implements IUbicacionDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('UbicacionDateService');
		this.$log.debug('ON');
	}

	public getUbicacionById(pUbicacion) {
		var _url = 'Ubicacion/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	public getAllMaterialesByUbicacion(pUbicacion) {
		var _url = 'Ubicacion/GetAllMaterialesByUbicacion/' + pUbicacion + '/';
		return this.DtoService.Get(_url);
	}

	public getUbicacionesDetalleByUbicacionAndTipo(pUbicacion, pTipo) {
		var _url = 'Ubicacion/GetDetalleByUbicacionAndTipo/' + pUbicacion + '/' + pTipo;
		return this.DtoService.Get(_url);
	}

	public getUbicacionesDetallePedidoByUbicacion(pUbicacion) {
		var _url = 'Ubicacion/GetUbicacionesDetallePedidoByUbicacion/' + pUbicacion + '/';
		return this.DtoService.Get(_url);
	}

	public getInternacionesPorUbicacion(pUbicacion) {
		var _url = 'Ubicacion/GetAllInternacionByIdUbicacion/' + pUbicacion + '/false';
		return this.DtoService.Get(_url);
	}

	public getInternacionesPorUbicacionOnly(pUbicacion, pDosificaciones) {
		var _url = 'Ubicacion/GetAllInternacionByIdUbicacionOnly/' + pUbicacion + '/' + pDosificaciones;
		return this.DtoService.Get(_url);
	}

	public getAllInternacionesBySucursal(pSucursal) {
		var _url = 'Ubicacion/GetInternacionesBySucursal/' + pSucursal;
		return this.DtoService.Get(_url);
		//para internacion NUEVA
		// 	var _url = '/Internacion/Admitido/Sucursal/' + pSucursal;
		// 	return this.DtoService.Get(_url);
	}

	public getAllMovimientoByUbicacion(pUbicacion) {
		var _url = 'Ubicacion/GetAllMovimientoById/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	public getAllMovimientoByUbicacionAndFechas(pObject) {
		var _url = 'MovimientoStock/GetAllByUbicacionAndFechas/';
		return this.DtoService.Post(_url, pObject, {isDictionary: true});
	}

	public getTotalNoRepuestoByUbicacionAndTipo(pUbicacion, pTipo) {
		var _url = 'Ubicacion/GetTotalNoRepuestoByUbicacionAndTipo/' + pUbicacion + '/' + pTipo;
		return this.DtoService.Get(_url);
	}

	public getTotalNoRepuestoByUbicacionAndInternacionAndTipo(pUbicacion, pInternacion, pTipo) {
		var _url = 'Ubicacion/GetNoRepuestoByUbicacionAndInternadoAndTipo/' + pUbicacion + '/' + pInternacion + '/' + pTipo;
		return this.DtoService.Get(_url);
	}

	public getTotalNoRepuestoVentanillaByUbicacion(pUbicacion) {
		var _url = 'Ubicacion/GetTotalNoRepuestoVentanillaByUbicacion/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	public getNoRepuestoVentanillaByUbicacionAndInternado(pUbicacion, pInternacion) {
		var _url = 'Ubicacion/GetNoRepuestoVentanillaByUbicacionAndInternado/' + pUbicacion + '/' + pInternacion;
		return this.DtoService.Get(_url);
	}

	public getUsuariosDesdeByIdUbicacion(pUbicacion) {
		var _url = 'Ubicacion/GetUsuariosDesdeById/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	public nuevoDetalleUbicacionByUbicacionYMaterialYTipo(pUbicacion, pMaterial, pTipo) {
		var _url = 'Ubicacion/NewUbicacionDetalleByIdAndIdMaterialAndTipo/' + pUbicacion + '/' + pMaterial + '/' + pTipo;
		return this.DtoService.Get(_url);
	}

	public getUbicacionPorNumeroInternado(pNumeroInternado) {
		var _url = 'Ubicacion/GetUbicacionByNumeroInternado/' + pNumeroInternado;
		return this.DtoService.Get(_url);
	}

	public getInternadoByIdUbicacion(pUbicacion) {
		var _url = 'Ubicacion/GetInternadoByIdUbicacion/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	public getInternacionesPendientesReposicionByUbicacion(pUbicacion) {
		var _url = 'Ubicacion/GetInternacionesPendientesReposicionById/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	public getUbicacionGuardiaBySucursal(pSucursal) {
		var _url = 'Ubicacion/GetUbicacionGuardiaBySucursal/' + pSucursal;
		return this.DtoService.Get(_url);
	}

	public getInformeByUbicacionAndFechas(pObject) {
		var _url = 'Ubicacion/GetInformeFarmaciaByUbicacionAndFechas/';
		return this.DtoService.Post(_url, pObject, {isDictionary: true});
	}

	public getInternadosByUbicacionInternado(pUbicaciones) {
		var _url = 'Ubicacion/GetInternadosByIdUbicacion/';
		return this.DtoService.Post(_url, pUbicaciones, {isDictionary: true});
	}

	public checkCantidades(pObject) {
		var _url = 'Ubicacion/CheckCantidades/';
		return this.DtoService.Post(_url, pObject);
	}

	public getQuirofanoBySucursal(idSucursal: number) {
		var _url = 'Ubicacion/GetUbicacionQuirofanoBySucursal/' + idSucursal;
		return this.DtoService.Get(_url);
	}

	// public getUbicacionAsignadaRecientemente(pUbicacion) {
	// 	var _url = 'Ubicacion/GetByUsuarioAsignadoRecientemente/' + pUbicacion;
	// 	return DotService.Get( _url);
	// }
	// public GetTotalNoAutorizadosByUbicacion (pUbicacion) {
	// 	var _url = 'Ubicacion/GetTotalNoAutorizadosByUbicacion/' + pUbicacion;
	// 	return DotService.Get( _url);
	// }
	// public GetMovimientosByUbicacion(pUbicacion) {
	// 	var _url = '/Ubicacion/GetAllMovimientoById/'+pUbicacion;
	// 	return DotService.Get( _url);	
	// }
	// public getDetallesConAjusteByUbicacion (pUbicacion) {
	// 	var _url = 'Ubicacion/GetDetallesConAjuste/'+pUbicacion;
	// 	return DotService.Get( _url);
	// }

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class UbicacionDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('UbicacionDataService', dataService.serviceFactory)
	}
}