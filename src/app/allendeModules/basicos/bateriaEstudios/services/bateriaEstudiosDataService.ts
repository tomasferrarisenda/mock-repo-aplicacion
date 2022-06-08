/**
* @author: crusso
* @description: Data Service
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { filtroBateriaEstudiosDto, bateriaEstudiosListDto, bateriaEstudiosEditDto, itemBateriaEstudiosEditDto } from '../model';

export interface IBateriaEstudiosDataService {
    getAll(): angular.IPromise<any>;
    getOne(id: number): angular.IPromise<any>;
    crearFiltroBateria(): angular.IPromise<bateriaEstudiosListDto>;
    eliminarBateriaEstudios(id: number): angular.IPromise<ValidationResultDto>;
    ObtenerBateriasPorFiltro(filtroDto: filtroBateriaEstudiosDto): angular.IPromise<any>;
    ObtenerNuevoItemEdit():angular.IPromise<bateriaEstudiosListDto>;
    ObtenerNuevaBateria():angular.IPromise<bateriaEstudiosEditDto>; // Ver con Pedro si esta bien que sea Any
    ObtenerBateriaPorIdParaEdicion(id: number):angular.IPromise<bateriaEstudiosListDto>;
    ObtenerTodosServicios() : angular.IPromise<Array<IEntidadDto>>
    guardar(bateriaEditDto: itemBateriaEstudiosEditDto): angular.IPromise<any>;
    obtenerItemsPendientesDeAsignarTurnos(idPaciente): angular.IPromise<any>;
    obtenerMotivosSolicitudNoAsignable():  angular.IPromise<any>;
    pasarSolicitudComoNoAsignableEnTurnos(dto): angular.IPromise<any>;
}

class dataService implements IBateriaEstudiosDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class bateriaEstudiosDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('bateriaEstudiosDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    getAll() {
        let url = 'HCE/SolicitudDeEstudios/Baterias/ObtenerTodos';
        return this.DtoService.Get(url);
    }

    getOne(id) {
        let url = `HCE/SolicitudDeEstudios/Baterias/ObtenerPorId/${id}`;
        return this.DtoService.Get(url);
    }

    crearFiltroBateria(){
		var url = 'HCE/SolicitudDeEstudios/Baterias/CrearFiltroBateria';
		return this.DtoService.Get(url);
    }

    //Eliminar Baterial del Edit
    eliminarBateriaEstudios(id) {
		var url = 'HCE/SolicitudDeEstudios/Baterias/Eliminar/' + id;
		return this.DtoService.Get(url);
    }
    
    guardar(bateriaEditDto) {//Ver RUTA si esta Bien//
        var _url = 'HCE/SolicitudDeEstudios/Baterias/Guardar';
        return this.DtoService.Post(_url, bateriaEditDto);
    }
    
    //Obtener Nuevo Item para Editar//
    ObtenerNuevoItemEdit(){
        var url = 'HCE/SolicitudDeEstudios/Baterias/ObtenerNuevoItemEdit';
        return this.DtoService.Get(url);
    }

    //Obtener Nuevo Te permite al "Agregar Nuevo", poder ver las tablas vacias en el Edit //
    ObtenerNuevaBateria(){
        var url = 'HCE/SolicitudDeEstudios/Baterias/ObtenerNuevo';
        return this.DtoService.Get(url);
    }

    //Obtener Por Id para ver que me trae en el momento de construir la Tabla del Edit //
    ObtenerBateriaPorIdParaEdicion(id){
        var url = 'HCE/SolicitudDeEstudios/Baterias/ObtenerBateriaParaEdicion/' + id;
        return this.DtoService.Get(url);
    }

    //Filtro que se Obtienen todos los Servicios del Sanatarorio
    ObtenerTodosServicios(){
        var url = 'Servicio/ObtenerTodos/false/false';
        return this.DtoService.Get(url);
    }

    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion

    ObtenerBateriasPorFiltro(filtroDto) {
		var url = 'HCE/SolicitudDeEstudios/Baterias/ObtenerBateriasPorFiltro';
		return this.DtoService.Post(url, filtroDto);
    }

    obtenerItemsPendientesDeAsignarTurnos(idPaciente){
        let url = 'HCE/SolicitudDeEstudios/ObtenerItemsPendientesDeAsignarTurnos/' + idPaciente;
        return this.DtoService.Get(url);
    }

    obtenerMotivosSolicitudNoAsignable(){
        var url = 'HCE/MotivoSolicitudNoAsignableEnTurnos/ObtenerTodos';
        return this.DtoService.Get(url);
    }

    pasarSolicitudComoNoAsignableEnTurnos(dto) {
		let url = `HCE/SolicitudDeEstudios/PasarSolicitudComoNoAsignableEnTurnos`;
        return this.DtoService.Post(url, dto);
	}
}

export class bateriaEstudiosDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('bateriaEstudiosDataService', dataService.serviceFactory())
    }
}