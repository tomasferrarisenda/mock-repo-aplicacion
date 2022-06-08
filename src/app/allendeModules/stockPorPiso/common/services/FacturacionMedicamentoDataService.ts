/**
* @author:         emansilla
* @description:    Data de Facturacion Medicamento
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IFacturacionMedicamentoDataService {
	getFacturacionesByNumeroInternado(numeroInternado);
	newFacturacion(numeroInternado, numeroArticulo, cantidad);
	editFacturacion(id, cantidad, idSucursal);
}

class dataService implements IFacturacionMedicamentoDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('FacturacionMedicamentoDateService');
		this.$log.debug('ON');
	}

	public getFacturacionesByNumeroInternado(pNumeroInternado) {
		var _url = 'FacturacionMedicamento/GetAllByNumeroInternado/' + pNumeroInternado;
		return this.DtoService.Get(_url);
	}

	public newFacturacion(pNumeroInternado, pNumeroArticulo, pCantidad) {
		var _url = 'FacturacionMedicamento/NewFacturacion/' + pNumeroInternado + '/' + pNumeroArticulo + '/' + pCantidad;
		return this.DtoService.Get(_url);
	}

	public editFacturacion(pId, pCantidad, pIdSucursal) {
		var _url = 'FacturacionMedicamento/EditFacturacion/' + pId + '/' + pCantidad + '/' + pIdSucursal;
		return this.DtoService.Get(_url);
	}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class FacturacionMedicamentoDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('FacturacionMedicamentoDataService', dataService.serviceFactory)
	}
}