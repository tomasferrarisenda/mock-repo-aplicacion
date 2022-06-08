/**
* @author:         emansilla
* @description:    Data de Grupo Farmacia
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IGrupoFarmaciaDataService {
	getGruposFarmacia();
	getGrupoPorId(id: number);
	guardarGrupo(grupo);
	eliminarGrupo(id: number);
}

class dataService implements IGrupoFarmaciaDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('GrupoFarmaciaDateService');
		this.$log.debug('ON');
	}

	public getGruposFarmacia() {
		var _url = 'GrupoFarmacia/ObtenerTodos/';
		return this.DtoService.Get(_url);
	}

	public getGrupoPorId(id: number) {
		var _url = 'GrupoFarmacia/ObtenerPorId/' + id;
		return this.DtoService.Get(_url);
	}

	public guardarGrupo(grupo) {
		var _url = 'GrupoFarmacia/Guardar/';
		return this.DtoService.Post(_url, grupo);
	}

	public eliminarGrupo(id: number) {
		var _url = 'GrupoFarmacia/EliminarPorId/' + id;
		return this.DtoService.Get(_url);
	}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class GrupoFarmaciaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('GrupoFarmaciaDataService', dataService.serviceFactory)
	}
}