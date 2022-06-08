/**
* @author: ppautasso
* @description: service data para ingresohce
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IIngresoHceDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	ingresarHCEAmbulatoriaPorPaciente(idPaciente: number): angular.IPromise<any>;
	ingresarHCEAmbulatoriaPorTurno(idTurno: number): angular.IPromise<any>;
}

class dataService implements IIngresoHceDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class IngresoHceDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('IngresoHceDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'HCE/Comun/IngresoHCE/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `HCE/Comun/IngresoHCE/${id}`;
		return this.DtoService.Get(url);
	}

	ingresarHCEAmbulatoriaPorPaciente(idPaciente: number) {
		let url = `HCE/Comun/IngresoHCE/IngresarHCEAmbulatoriaPorPaciente/${idPaciente}`;
		return this.DtoService.Get(url);
	}

	ingresarHCEAmbulatoriaPorTurno(idTurno: number) { 
		let url = `HCE/Comun/IngresoHCE/IngresarHCEAmbulatoriaPorTurno/${idTurno}`;
		return this.DtoService.Get(url);
	}


	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class IngresoHceDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('IngresoHceDataService', dataService.serviceFactory())
	}
}