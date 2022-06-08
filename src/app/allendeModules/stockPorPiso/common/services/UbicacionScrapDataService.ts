/**
* @author:         emansilla
* @description:    Ubicaciones Scrap
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IUbicacionScrapDataService {
	newUbicacionScrapEnfermera(ubicacionSrap);
	getUbicacionScrapEnfermeraByUbicacion(idUbicacion);

	newUbicacionScrapTraslado(ubicacionSrap);
	getUbicacionScrapTrasladoByUbicacion(idUbicacion);
}

class dataService implements IUbicacionScrapDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('NameDateService');
		this.$log.debug('ON');
	}

	//UbicacionScrapEnfermera
	public newUbicacionScrapEnfermera(pUbicacionScrap) {
		var _url = 'UbicacionScrapEnfermera/AddOne/';
		return this.DtoService.Post(_url, pUbicacionScrap);
	}

	public getUbicacionScrapEnfermeraByUbicacion(pUbicacion) {
		var _url = 'UbicacionScrapEnfermera/GetOneByIdUbicacion/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	//UbicacionScrapTraslado
	public newUbicacionScrapTraslado(pUbicacionScrap) {
		var _url = 'UbicacionScrapTraslado/AddOne/';
		return this.DtoService.Post(_url, pUbicacionScrap);
	}

	public getUbicacionScrapTrasladoByUbicacion(pUbicacion) {
		var _url = 'UbicacionScrapTraslado/GetOneByIdUbicacion/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class UbicacionScrapDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('UbicacionScrapDataService', dataService.serviceFactory)
	}
}