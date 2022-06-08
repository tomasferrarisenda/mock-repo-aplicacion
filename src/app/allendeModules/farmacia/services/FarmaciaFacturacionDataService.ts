/**
* @author: ppautasso
* @description: data service para facturacion de farmacia
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { FacturacionMedicamentoEdit } from '../models/FacturacionMedicamentoEdit';
import { IFacturarMedicamentoInternadoDto } from '../models';

export interface IFarmaciaFacturacionDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerPorInternacion(pIdInternacion: number): angular.IPromise<any>;
	eliminarPorIdSucursal(pId: number, pIdSucursal: number): angular.IPromise<any>;
	eliminarPorIdInternacion(pId: number, pIdInternacion: number): angular.IPromise<any>;
	obtenerNuevo(): angular.IPromise<any>;
	guardar(pFacturacionMedicamentoEdit: FacturacionMedicamentoEdit): angular.IPromise<any>;
	obtenerAuditoriaInternacion(pId: number, pIdSucursal: number): angular.IPromise<any>;
	agregarMultiples(facturarMedicamentoInternado: IFacturarMedicamentoInternadoDto): angular.IPromise<any>;
	obtenerNuevoFacturarMedicamentoInternado(): angular.IPromise<any>;
	editarPorcentajePracticaInternado(pIdInternacion: number, pCodigoPractica: number, pPorcentajeMedicamento: number,
		pPorcentajeDescartable: number, pFechaDesde: string, pFechaHasta: string): angular.IPromise<any>;
}

class dataService implements IFarmaciaFacturacionDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class FarmaciaFacturacionDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('FarmaciaFacturacionDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Facturacion/Legacy/FacturacionMedicamento2/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Facturacion/Legacy/FacturacionMedicamento2/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerPorInternacion(pIdInternacion){
		let url = `Facturacion/Legacy/FacturacionMedicamento2/ObtenerPorInternacion/${pIdInternacion}`;
		return this.DtoService.Get(url);
	}

	eliminarPorIdSucursal(pId, pIdSucursal){
		let url = `Facturacion/Legacy/FacturacionMedicamento2/EliminarPorIdSucursal/${pId}/${pIdSucursal}`;
		return this.DtoService.Get(url);
	}

	eliminarPorIdInternacion(pId, pIdInternacion){
		let url = `Facturacion/Legacy/FacturacionMedicamento2/EliminarPorIdInternacion/${pId}/${pIdInternacion}`;
		return this.DtoService.Get(url);
	}

	obtenerNuevo(){
		let url = `Facturacion/Legacy/FacturacionMedicamento2/ObtenerNuevo`;
		return this.DtoService.Get(url);
	}

	guardar(pFacturacionMedicamentoEdit: FacturacionMedicamentoEdit){
		let url = `Facturacion/Legacy/FacturacionMedicamento2/Guardar`;
		return this.DtoService.Post(url, pFacturacionMedicamentoEdit);
	}
	
	obtenerAuditoriaInternacion(pId, pIdSucursal){
		let url = `Facturacion/Legacy/FacturacionMedicamentoAuditoria/ObtenerPorId/${pId}/${pIdSucursal}`;
		return this.DtoService.Get(url);
	}

	agregarMultiples(facturarMedicamentoInternado: IFacturarMedicamentoInternadoDto){
		let url = `Facturacion/Legacy/FacturacionMedicamento2/AgregarMultiples`;
		return this.DtoService.Post(url, facturarMedicamentoInternado);
	}

	obtenerNuevoFacturarMedicamentoInternado(){
		let url = `Facturacion/Legacy/FacturacionMedicamento2/ObtenerNuevoFacturarMedicamentoInternado`;
		return this.DtoService.Get(url);
	}

	editarPorcentajePracticaInternado(pIdInternacion, pCodigoPractica, pPorcentajeMedicamento, pPorcentajeDescartable, pFechaDesde, pFechaHasta) { 
		let url = `Facturacion/Legacy/FacturacionMedicamento2/EditarPorcentajePracticaInternado/${pIdInternacion}/${pCodigoPractica}
		/${pPorcentajeMedicamento}/${pPorcentajeDescartable}/${pFechaDesde}/${pFechaHasta}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class FarmaciaFacturacionDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('FarmaciaFacturacionDataService', dataService.serviceFactory())
	}
}