/**
* @author:         emansilla
* @description:    Data de materiales / descartable
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IMaterialDataService {
	getAllMateriales();
	getMaterialesDto();
	getMaterialByProducto(idProducto);
	getMaterialesNoNormalPorUbicacion(idUbicacion);
	obtenerParaCambioPorArticuloReferenciaYDroga(numeroArticulo, droga);
}

class dataService implements IMaterialDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('MaterialDateService');
		this.$log.debug('ON');
	}

	public getAllMateriales() {
		var _url = '/Material/';
		return this.DtoService.Get(_url);
	}

	public getMaterialesDto() {
		var _url = 'Material/ObtenerTodos/';
		return this.DtoService.Get(_url);
	}
	
	public obtenerParaCambioPorArticuloReferenciaYDroga(numeroArticulo, droga) {
		var _url = 'Material/ObtenerParaCambioPorArticuloReferenciaYDroga/' + numeroArticulo + '/' + droga;
		return this.DtoService.Get(_url);
	}

	public getMaterialByProducto(pProducto) {
		var _url = 'Material/GetMaterialByIdProducto/' + pProducto + '/';
		return this.DtoService.Get(_url);
	}

	public getMaterialesNoNormalPorUbicacion(pUbicacion) {
		var _url = 'Material/GetAllMaterialesNoStockByUbicacion/' + pUbicacion + '/';
		return this.DtoService.Get(_url);
	}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class MaterialDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('MaterialDataService', dataService.serviceFactory)
	}
}