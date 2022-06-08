/**
* @author: ppautasso
* @description: data service para RevaluacionController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import {IRevaluarDto, IFiltroBusquedaItemsParaRevaluacionDto} from '../models/'

export interface IRevaluacionDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	revaluar(revaularDto: IRevaluarDto): angular.IPromise<any>;
	obtenerPorFiltro(filtroDto: IFiltroBusquedaItemsParaRevaluacionDto): angular.IPromise<any>;
}

class dataService implements IRevaluacionDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class RevaluacionDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('RevaluacionDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Revaluacion/ObtenerTodos';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Revaluacion/${id}`;
		return this.DtoService.Get(url);
	}

	revaluar(revaularDto: IRevaluarDto){
		let url = "Revaluacion/Revaluar/";
		return this.DtoService.Post(url, revaularDto);
	}

	obtenerPorFiltro(filtroDto: IFiltroBusquedaItemsParaRevaluacionDto){
		let url = "Revaluacion/ObtenerPorFiltro/";
		return this.DtoService.Post(url, filtroDto);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class RevaluacionDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('RevaluacionDataService', dataService.serviceFactory())
	}
}