/**
* @author:         emansilla
* @description:    Data de tipo sexo
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface ITipoSexoDataService {
	getAllTipoSexo();
	getAllTipoSexoValidos();
	obtenerTodosTipoSexo();
	obtenerTiposSexoMF();
}

class dataService implements ITipoSexoDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('TipoSexoDateService');
		this.$log.debug('ON');
	}

	public getAllTipoSexo() {
		var _url = 'TipoSexo/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public getAllTipoSexoValidos() {
		var _url = 'legacy/TipoSexo/Validos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public obtenerTodosTipoSexo() {
		var _url = 'TipoSexo/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	public obtenerTiposSexoMF() {
		var _url = 'TipoSexo/ObtenerSoloMascYFem';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class TipoSexoDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('TipoSexoDataService', dataService.serviceFactory)
	}
}