/**
* @author: emansilla
* @description: Acceso a cuentas
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService, GetDataService, IGetDataService  } from '../../../../../core/http';
import { CuentaDto } from '../../../common';
import { FiltroCuentaDto } from '../model';

export interface ICuentaDataService extends IGetDataService<CuentaDto> {
	// getAll(): angular.IPromise<CuentaDto[]>;
	// getOne(id: number): angular.IPromise<CuentaDto>;
	obtenerPorCodigo(codigo: number): angular.IPromise<CuentaDto>;
	borrarCuenta(id: number): angular.IPromise<ValidationResultDto>;
	ObtenerFiltroCuentaDto(): angular.IPromise<FiltroCuentaDto>;
	ObtenerCuentasPorFiltro(filtroDto : FiltroCuentaDto): angular.IPromise<CuentaDto[]>;
	guardar(Cuenta: CuentaDto) : angular.IPromise<any>;
}

class dataService extends GetDataService<CuentaDto> implements ICuentaDataService {

	constructor($log: ILogger, DtoService: IDtoService) {
		super($log, DtoService, 'Cuenta/')
		this.$log = this.$log.getInstance('CuentaDataService');
		this.$log.debug('ON');
	}

	// getAll() { 
	// 	var url = 'Cuenta/ObtenerTodos';
	// 	return this.http.Get(url);
	// }

	// getOne(id) {
	// 	var url = 'Cuenta/ObtenerPorId/' + id;
	// 	return this.http.Get(url);
	// }

	obtenerPorCodigo(codigo) {
		var url = 'Cuenta/ObtenerCuentaPorCodigo/' + codigo;
		return this.http.Get(url);
	}

	borrarCuenta(id) {
		var url = 'Cuenta/EliminarCuentaPorId/' + id;
		return this.http.Post(url, id);
	}

	ObtenerCuentasPorFiltro(filtroDto) {
		var url = 'Cuenta/ObtenerCuentasPorFiltro/' + filtroDto;
		return this.http.Post(url, filtroDto);
	}

	ObtenerFiltroCuentaDto(){
		var url = 'Cuenta/ObtenerFiltroCuentaDto';
		return this.http.Get(url);
	}

	guardar(cuentas){
		var url = 'Cuenta/Guardar';
		return this.http.Post(url, cuentas)
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
}

export class CuentaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('CuentaDataService', dataService.serviceFactory())
	}
}