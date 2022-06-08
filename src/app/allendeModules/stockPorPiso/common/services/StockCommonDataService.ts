/**
* @author:         emansilla
* @description:    Data comun para Stock
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IStockCommonDataService {
	getAllTipoUbicacionDetalle();
	getUsuarioByNombre(userName);
	getFarmaciaByEdificio(idEdificio);
	newUbicacionInternacion(idInternacion);
	getAllSubsecciones();
	getAllPisosPorEdificio(idEdificio);
	getEstadosDosificacion();
	getEstadosDosificacionHabilitados();
}

class dataService implements IStockCommonDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('StockCommonDateService');
		this.$log.debug('ON');
	}

	public getAllTipoUbicacionDetalle() {
		var _url = 'TipoUbicacionDetalle/';
		return this.DtoService.Get(_url);
	}

	// public getAllUsuarios() {
	// 	var _url = 'Usuario';
	// 	return this.DtoService.Get(_url);
	// }

	public getUsuarioByNombre(pUsuario) {
		var _url = 'Usuario/GetByUserName/' + pUsuario;
		return this.DtoService.Get(_url);
	}

	// public getAllTipoMovimiento() {
	// 	var _url = 'TipoMovimientoStock';
	// 	return this.DtoService.Get( _url);
	// }

	//Farmacia
	public getFarmaciaByEdificio(pEdificio) {
		var _url = 'Farmacia/GetByIdEdificio/' + pEdificio;
		return this.DtoService.Get(_url);
	}

	//Internacion
	public newUbicacionInternacion(pInternacion) {
		var _url = 'legacy/Internacion/NewUbicacionInternacion/' + pInternacion;
		return this.DtoService.Get(_url);
	}

	//Subseccion
	public getAllSubsecciones() {
		var _url = 'Subseccion';
		return this.DtoService.Get(_url);
	}

	//Sucursal
	// public getSucursalPorId(pSucursal) {
	// 	var _url = 'legacy/SucursaL/' + pSucursal;
	// 	return this.DtoService.Get(_url);
	// }

	//Edificio
	public getAllPisosPorEdificio(pEdificio) {
		var _url = 'legacy/Edificio/GetPisosConUbicacionMedica/' + pEdificio;
		return this.DtoService.Get(_url);
	}

	// public getAllVias() {
	// 	var _url = 'Via';
	// 	return this.DtoService.Get(_url);
	// }

	// public getAllTiposDosis() {
	// 	var _url = 'TipoDosisPrescripcion';
	// 	return this.DtoService.Get(_url);
	// }

	// public GetAllMaterialesAEntregarByUbicacion(pUbicacion) {
	// 	var _url = 'Prescripcion/GetAllMaterialesVentanillaByUbicacion/' + pUbicacion+ '/';
	// 	return this.DtoService.Get( _url);
	// }

	public GetUsuariosByIdUbicacion() {
		var _url = 'Usuario';
		return this.DtoService.Get(_url);
	}

	//Descartable

	public getEstadosDosificacion() {
		var _url = 'EstadoDosificacionLegacy/';
		return this.DtoService.Get(_url);
	}

	public getEstadosDosificacionHabilitados() {
		var _url = 'EstadoDosificacionLegacy/GetHabilitadas';
		return this.DtoService.Get(_url);
	}


	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class StockCommonDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('StockCommonDataService', dataService.serviceFactory)
	}
}