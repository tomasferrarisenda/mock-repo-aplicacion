/**
* @author:         emansilla
* @description:    Data para Enfermera
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IEnfermeraDataService {
	getUbicacionesByUsuarioAndSucursal(idUsuario, idSucursal);
	getLastAsignacionByIdUsuario(idUsuario);
	addAsignacion(asignacion);
	getAllEnfermeras();
}

class dataService implements IEnfermeraDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('EnfermeraDateService');
		this.$log.debug('ON');
	}

	public getUbicacionesByUsuarioAndSucursal(pUsuario, pSucursal) {
		var _url = 'Enfermera/GetUbicacionesPisoByUsuarioAndIdSucursal/' + pUsuario + '/' + pSucursal;
		return this.DtoService.Get(_url);
	}

	public getLastAsignacionByIdUsuario(pUsuario) {
		var _url = 'Enfermera/GetLastAsignacionByIdUsuario/' + pUsuario;
		return this.DtoService.Get(_url);
	}

	public addAsignacion(pAsignacion) {
		var _url = 'Enfermera/NewAsignacion/';
		return this.DtoService.Post(_url, pAsignacion);
	}

	// public getAllEnfermerasByUbicacion(pUbicacion) {
	// 	var _url = 'Enfermera/GetAllByUbicacion/'+ pUbicacion;
	// 	return this.DtoService.Get( _url);
	// }


	// public GetEnfermerasByIdUbicacion(pUbicacion) {
	// 	var _url = 'Enfermera/GetUsuariosByIdUbicacion/'+ pUbicacion;
	// 	return this.DtoService.Get( _url);
	// }

	public getAllEnfermeras() {
		var _url = 'Enfermera/GetAllUsuarios/';
		return this.DtoService.Get(_url);
	}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class EnfermeraDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('EnfermeraDataService', dataService.serviceFactory)
	}
}