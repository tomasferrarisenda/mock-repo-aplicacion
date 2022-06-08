/**
* @author:         emansilla
* @description:    Data de prescripción
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IPrescripcionDataService {
	getPrescripcionConPedidoBySucursal(idSucursal);
	getPrescripcionByIdUbicacionPaciente(idUbicacion);
	getPrescripcionDetalleMaterialById(id);
	getPacientesGuardia(idUbicacion);
}

class dataService implements IPrescripcionDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('PrescripcionDateService');
		this.$log.debug('ON');
	}

	public getPrescripcionConPedidoBySucursal(pSucursal) {
		var _url = '/Prescripcion/GetPrescripcionConPedidoBySucursal/' + pSucursal;
		return this.DtoService.Get(_url);
	}

	public getPrescripcionByIdUbicacionPaciente(pUbicacion) {
		var _url = '/Prescripcion/GetOneByIdUbicacionPaciente/' + pUbicacion;
		return this.DtoService.Get(_url);
	}

	public getPrescripcionDetalleMaterialById(pId) {
		var _url = 'PrescripcionDetalleMaterial/' + pId;
		return this.DtoService.Get(_url);
	}

	public getPacientesGuardia(idUbicacion) {
		var _url = 'Prescripcion/GetPacientesFarmacia/' + idUbicacion;
		return this.DtoService.Get(_url);
	}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class PrescripcionDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('PrescripcionDataService', dataService.serviceFactory)
	}
}