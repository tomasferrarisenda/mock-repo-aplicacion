/**
* @author: pferrer
* @description: DataService Grupo de Prestaciones Medicas
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { FiltroGrupoPrestacionMedicaDto } from '../model/filtroGrupoPrestacionMedicaDto';
import { GrupoPrestacionMedicaEditDto } from '../model/grupoPrestacionMedicaEditDto';
import { ItemGrupoPrestacionMedicaListDto } from '../model/itemGrupoPrestacionMedicaListDto';
import { FiltroGrupoDePrestacionMedica } from '../../../../basicos/prestaciones/common/models';


export interface IGrupoPrestacionMedicaDataService {
    getOne(id: number): angular.IPromise<GrupoPrestacionMedicaEditDto>;
    getAll(): angular.IPromise<any>;
    crearFiltroGrupo(): angular.IPromise<FiltroGrupoPrestacionMedicaDto>;
    obtenerPorServicio(filtro: FiltroGrupoPrestacionMedicaDto): angular.IPromise<any>;
    eliminar(id: number): angular.IPromise<any>;
    nuevo(): angular.IPromise<GrupoPrestacionMedicaEditDto>;
    obtenerNuevoItemEdit() : angular.IPromise<ItemGrupoPrestacionMedicaListDto>;
    guardar( grupoPrestacionMedica: GrupoPrestacionMedicaEditDto): angular.IPromise<any>;
    ObtenerTodosServicios() : angular.IPromise<Array<IEntidadDto>>
    obtenerPorServicioSucursal(pIdServicio, pIdSucursal): angular.IPromise<any>;
    obtenerPorServicioSucursalConFiltro(pFiltro): angular.IPromise<any>;
    obtenerRelacionadosPorRecursoServicioSucursal(FiltroGrupoDePrestacionMedica: FiltroGrupoDePrestacionMedica): angular.IPromise<any>;
    obtenerPorServicioSucursalYRecurso(pFiltroGrupoDePrestacionMedica: FiltroGrupoDePrestacionMedica): angular.IPromise<any>;
   
}

class dataService implements IGrupoPrestacionMedicaDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class NameDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('IGrupoPrestacionMedicaDataService');
        this.$log.debug('ON');
    }

    urlBaseGrupoPrestacion = 'Turnos/GruposDePrestacionesMedicas/';

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    getOne(id) {
        let url = this.urlBaseGrupoPrestacion +'ObtenerGrupoParaEdicion/' + id;
        return this.DtoService.Get(url);
    }

    getAll(){
        var url = "Turnos/GruposDePrestacionesMedicas/ObtenerTodos";
        return this.DtoService.Get(url);
    }

    nuevo() {
        var url = this.urlBaseGrupoPrestacion + 'ObtenerNuevo';
        return this.DtoService.Get(url);
    };

    obtenerNuevoItemEdit() {
        var url = this.urlBaseGrupoPrestacion + 'ObtenerNuevoItemEdit';
        return this.DtoService.Get(url);
    };

    crearFiltroGrupo() {
        var url = this.urlBaseGrupoPrestacion +'CrearFiltroGrupo';
        return this.DtoService.Get(url);
    }

    obtenerPorServicio(filtro) {
        var url = this.urlBaseGrupoPrestacion +'ObtenerPorServicio';
        return this.DtoService.Post(url, filtro);
    }

    eliminar(id) {
        var url = this.urlBaseGrupoPrestacion + 'Eliminar/' + id;
        return this.DtoService.Get(url);
    }

    guardar(grupoPrestacion) {
        var url = this.urlBaseGrupoPrestacion + 'Guardar';
        return this.DtoService.Post(url, grupoPrestacion);
    };

    ObtenerTodosServicios(){
        var url = 'Servicio/ObtenerTodos/false/false';
        return this.DtoService.Get(url);
    }

    obtenerPorServicioSucursal(pIdServicio, pIdSucursal){
		let url = `Turnos/GruposDePrestacionesMedicas/ObtenerGruposGeneralesPorServicioSucursal/` + pIdServicio + '/' + pIdSucursal;
		return this.DtoService.Get(url);
    }
    
    obtenerPorServicioSucursalConFiltro(pFiltro){
		let url = `Turnos/GruposDePrestacionesMedicas/ObtenerGruposGeneralesPorServicioSucursal/` + pFiltro.pIdServicio + '/' + pFiltro.pIdSucursal;
		return this.DtoService.Get(url);
	}

    obtenerRelacionadosPorRecursoServicioSucursal(pFiltroGrupoDePrestacionMedica: FiltroGrupoDePrestacionMedica){
        let url = `Turnos/GruposDePrestacionesMedicas/ObtenerRelacionadosPorRecursoServicioSucursal/`;
        return this.DtoService.Post(url, pFiltroGrupoDePrestacionMedica);
    }
    
	obtenerPorServicioSucursalYRecurso(pFiltroGrupoDePrestacionMedica: FiltroGrupoDePrestacionMedica){
		let url = `Turnos/GruposDePrestacionesMedicas/ObtenerPorServicioSucursalYRecurso/`;
		return this.DtoService.Post(url, pFiltroGrupoDePrestacionMedica);
    }
    

    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion
}

export class GrupoPrestacionMedicaDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('GrupoPrestacionMedicaDataService', dataService.serviceFactory())
    }
}