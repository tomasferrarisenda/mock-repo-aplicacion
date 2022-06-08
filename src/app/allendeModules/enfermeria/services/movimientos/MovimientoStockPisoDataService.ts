/**
* @author: ppautasso
* @description: data service correspondiente a moviemiento stock piso 
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

import { FiltroBusquedaMovimientoPiso, MovimientoStockPisoAsignacionEdit, MovimientoStockPisoEditBase, MovimientoStockAsignacionViewDto } from '../../models'

export interface IMovimientoStockPisoDataService {
    getAll(): angular.IPromise<any>;
    getOne(id: number): angular.IPromise<any>;
    obtenerPorFiltros(pFiltroBusquedaMovimientoPiso: FiltroBusquedaMovimientoPiso): angular.IPromise<any>;
    obtenerNuevoFiltro(): angular.IPromise<any>;
    obtenerNuevoMovimientoParaAjuste(): angular.IPromise<any>;
    obtenerNuevoMovimientoParaAsignacion(): angular.IPromise<any>;
    obtenerNuevoMovimientoParaScrap(): angular.IPromise<any>;
    obtenerNuevoMovimientoParaReposicion(): angular.IPromise<any>;
    obtenerNuevoMovimientoParaDevolucionFI(): angular.IPromise<any>;
    obtenerNuevoItemMovimiento(): angular.IPromise<any>;

    realizarAsignacion(movimiento: MovimientoStockPisoAsignacionEdit): angular.IPromise<any>;
    realizarScrap(movimiento: MovimientoStockPisoEditBase): angular.IPromise<any>;
    realizarAjuste(movimiento: MovimientoStockPisoEditBase): angular.IPromise<any>;
    realizarReposicion(movimiento: MovimientoStockPisoEditBase): angular.IPromise<any>;
    realizarDevolucionAFI(movimiento: MovimientoStockPisoEditBase): angular.IPromise<any>;
    realizarDevolucionDeAsignacion(pIdMovimiento: number, pObservaciones: string): angular.IPromise<any>;

    realizarDevolucionParcialDeAsignacion(movimiento:MovimientoStockAsignacionViewDto): angular.IPromise<any>;
    obtenerMovimientoAsignacionADevolver(pIdMovimiento: number): angular.IPromise<any>;
}

class dataService implements IMovimientoStockPisoDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class MovimientoStockPisoDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('MovimientoStockPisoDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    getAll() {
        let url = 'Stock2/Movimientos/MovimientoStockPiso/';
        return this.DtoService.Get(url);
    }

    getOne(id) {
        let url = `Stock2/Movimientos/MovimientoStockPiso/${id}`;
        return this.DtoService.Get(url);
    }

    obtenerNuevoFiltro(){
        let url = 'Stock2/Movimientos/MovimientoStockPiso/ObtenerNuevoFiltro/';
        return this.DtoService.Get(url);
    }

    obtenerPorFiltros(pFiltroBusquedaMovimientoPiso: FiltroBusquedaMovimientoPiso){
        let url = `Stock2/Movimientos/MovimientoStockPiso/ObtenerPorFiltros/`;
        return this.DtoService.Post(url, pFiltroBusquedaMovimientoPiso);
    }

    obtenerNuevoMovimientoParaAjuste(){
        let url = 'Stock2/Movimientos/MovimientoStockPiso/ObtenerNuevoMovimientoParaAjuste/';
        return this.DtoService.Get(url);
    }

    obtenerNuevoMovimientoParaAsignacion() {
        let url = 'Stock2/Movimientos/MovimientoStockPiso/ObtenerNuevoMovimientoParaAsignacion/';
        return this.DtoService.Get(url);
    }

    obtenerNuevoMovimientoParaScrap() {
        let url = 'Stock2/Movimientos/MovimientoStockPiso/ObtenerNuevoMovimientoParaScrap/';
        return this.DtoService.Get(url);
    }

    obtenerNuevoMovimientoParaReposicion() {
        let url = 'Stock2/Movimientos/MovimientoStockPiso/ObtenerNuevoMovimientoParaReposicion/';
        return this.DtoService.Get(url);
    }

    obtenerNuevoMovimientoParaDevolucionFI() {
        let url = 'Stock2/Movimientos/MovimientoStockPiso/ObtenerNuevoMovimientoParaDevolucionAFarmaciaInterna/';
        return this.DtoService.Get(url);
    }
    
    obtenerNuevoItemMovimiento() {
        let url = 'Stock2/Movimientos/MovimientoStockPiso/ObtenerNuevoItemMovimiento/';
        return this.DtoService.Get(url);
    }

    realizarAsignacion(movimiento: MovimientoStockPisoAsignacionEdit) {
        let url = `Stock2/Movimientos/MovimientoStockPiso/RealizarAsignacion/`;
        return this.DtoService.Post(url, movimiento);
    }

    realizarScrap(movimiento: MovimientoStockPisoEditBase) {
        let url = `Stock2/Movimientos/MovimientoStockPiso/RealizarScrap/`;
        return this.DtoService.Post(url, movimiento);
    }

    realizarAjuste(movimiento: MovimientoStockPisoEditBase) {
        let url = `Stock2/Movimientos/MovimientoStockPiso/RealizarAjuste/`;
        return this.DtoService.Post(url, movimiento);
    }

    realizarReposicion(movimiento: MovimientoStockPisoEditBase) {
        let url = `Stock2/Movimientos/MovimientoStockPiso/RealizarReposicion/`;
        return this.DtoService.Post(url, movimiento);
    }

    realizarDevolucionAFI(movimiento: MovimientoStockPisoEditBase) {
        let url = `Stock2/Movimientos/MovimientoStockPiso/RealizarDevolucionAFarmaciaInterna/`;
        return this.DtoService.Post(url, movimiento);
    }

    realizarDevolucionDeAsignacion(pIdMovimiento: number, pObservaciones: string){
        let url = 'Stock2/Movimientos/MovimientoStockPiso/RealizarDevolucionDeAsignacion/' + pIdMovimiento + '/' + pObservaciones;
        return this.DtoService.Get(url);
    }

    realizarDevolucionParcialDeAsignacion(movimiento:MovimientoStockAsignacionViewDto){
        let url = `Stock2/Movimientos/MovimientoStockPiso/RealizarDevolucionParcialDeAsignacion/`;
        return this.DtoService.Post(url, movimiento);
    }

    obtenerMovimientoAsignacionADevolver(pIdMovimiento: number){
        let url = 'Stock2/Movimientos/MovimientoStockPiso/ObtenerMovimientoAsignacionADevolver/' + pIdMovimiento;
        return this.DtoService.Get(url);
    }


    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion
}

export class MovimientoStockPisoDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('MovimientoStockPisoDataService', dataService.serviceFactory())
    }
}