/**
* @author: ppautasso
* @description: Data service para CambiarProductoIndicacionMedicaController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface ICambiarProductoIndicacionMedicaDataService {
    getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerProductosPosiblesParaCambiar(pIdTipoConcepto: number, pIdConcepto: number, pIdSucursal: number): angular.IPromise<any>;
	cambiarProductoIndicacionMedica(pIdTipoConcepto: number, pIdConcepto: number, pIdSucursal: number, pIdTipoStockeable: number, pIdStockeable: number): angular.IPromise<any>;
}

class dataService implements ICambiarProductoIndicacionMedicaDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class CambiarProductoIndicacionMedicaDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('CambiarProductoIndicacionMedicaDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    getAll() {
        let url = 'IndicacionesMedicas/FarmaciaInterna/CambiarProductoIndicacionMedica/';
        return this.DtoService.Get(url);
    }

    getOne(id) {
        let url = `IndicacionesMedicas/FarmaciaInterna/CambiarProductoIndicacionMedica/${id}`;
        return this.DtoService.Get(url);
	}

	obtenerProductosPosiblesParaCambiar(_relacion: any){
		let url = `IndicacionesMedicas/FarmaciaInterna/CambiarProductoIndicacionMedica/ObtenerProductosPosiblesParaCambiar/${_relacion.pIdTipoConcepto}/${_relacion.pIdConcepto}/${_relacion.pIdSucursal}`;
        return this.DtoService.Get(url);
	}

	cambiarProductoIndicacionMedica(pIdTipoConcepto: number, pIdConcepto: number, pIdSucursal: number, pIdTipoStockeable: number, pIdStockeable: number){
		let url = `IndicacionesMedicas/FarmaciaInterna/CambiarProductoIndicacionMedica/CambiarProducto/${pIdTipoConcepto}/${pIdConcepto}/${pIdSucursal}/${pIdTipoStockeable}/${pIdStockeable}`;
        return this.DtoService.Get(url);
	}
	

    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion
}

export class CambiarProductoIndicacionMedicaDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('CambiarProductoIndicacionMedicaDataService', dataService.serviceFactory())
    }
}