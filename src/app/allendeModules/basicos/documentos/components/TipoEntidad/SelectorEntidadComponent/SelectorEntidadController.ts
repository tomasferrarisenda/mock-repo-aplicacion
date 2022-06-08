/**
* @author: pferrer
* @description: Directiva/Componente o como quiera mansilla llamarlo, de tipos de entidades para documentacion
* @type: Controller
**/
import * as angular from 'angular';
import { IAdministradorDocumentoDataService } from '../../../services/AdministradorDocumentoDataService'
import { TipoEntidadDocumentoDto, EntidadDocumentacion, FiltroEntidadDocumentoAsociado } from '../../../model';

export class SelectorEntidadController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '',
        icon: ''
    };

    resolve;
    dismiss;
    close;

    codigo: string = '';
    IdTipoEntidad : number = 0;
    nombre: string = '';
    ngDisabled: any = '';
    initTipo: IEntidadDto = {};

    entidadSeleccionada: EntidadDocumentacion = {Id : 0, IdTipoEntidad : 0};
    listadoEntidades : EntidadDocumentacion[] = [];
    listadoEntidadesFiltradas : EntidadDocumentacion[] = [];

    tipoEntidadElegida: TipoEntidadDocumentoDto = {Id : 0};
    tiposEntidad: TipoEntidadDocumentoDto[] = [];

    filtroDto: FiltroEntidadDocumentoAsociado = {};

    paginacion = {
        currentPage: 0,
        pageSize: 0,
        totalItems: 0
    } ;


    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    static $inject: Array<string> = ['Logger', 'AdministradorDocumentoDataService', 'ModalService', 'AlertaService', '$filter'];
    constructor(private $log: ILogger, private AdministradorDocumentoDataService: IAdministradorDocumentoDataService, private ModalService : IModalService, private AlertaService : IAlertaService, private $filter) {}

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    cargarComboTipos() {
        this.AdministradorDocumentoDataService.TipoEntidadObtenerTodos().then((tiposEntidad) => {
            this.tiposEntidad = tiposEntidad;
            this.tiposEntidad.forEach(tipoEntidad => {
                if(tipoEntidad.Id === this.resolve.idTipoEntidadElegida)
                    this.tipoEntidadElegida = tipoEntidad;
            });
        });
    }
    
    updateView(entidad) {
        this.entidadSeleccionada = entidad ? entidad : null;
        this.codigo = entidad ? entidad.Codigo : null;
        this.nombre = entidad ? entidad.Nombre : '';
    }

    cambioTipoEntidad(){
        this.updateView(null);
    }

    buscar(){
        if(!this.codigo.trim() && !this.nombre.trim()) return this.AlertaService.NewWarning("Debe filtrarse por "+ this.tipoEntidadElegida.DescripcionCodigo +" y/o Nombre.", "");
        this.filtroDto.Codigo = this.codigo;
        this.filtroDto.Nombre = this.nombre;
        this.filtroDto.IdTipoEntidad = this.tipoEntidadElegida.Id;
        this.AdministradorDocumentoDataService.ObtenerEntidadesPorFiltro(this.filtroDto).then(
            (entidadesFiltradas) => {
                this.listadoEntidades = entidadesFiltradas;
                this.getPage();
        });
    }

    limpiarFiltros(){
        this.codigo = '';
        this.nombre = '';
        this.paginacion.currentPage = 1;
        this.tipoEntidadElegida = this.tiposEntidad[0];
        this.getPage();
    }

    getPage() {
        var begin = ((this.paginacion.currentPage - 1) * this.paginacion.pageSize);
        var end = begin + this.paginacion.pageSize;
        this.listadoEntidadesFiltradas = this.listadoEntidades;
        this.paginacion.totalItems = this.listadoEntidadesFiltradas.length;
        this.listadoEntidadesFiltradas = this.listadoEntidadesFiltradas.slice(begin, end);
    }

    pageChanged() {
        this.getPage();
    }

    cancel() {
		this.dismiss({ $value: 'cancel' });
    }
    
    entidadSeleccion(entidad){
        this.close({$value: entidad});
    }
    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    $onInit() {
        this.$log = this.$log.getInstance('SelectorEntidadController');
        this.$log.debug('ON');
        this.activate();
    }

    activate() {
        this.cargarComboTipos();
        this.AdministradorDocumentoDataService.ObtenerFiltroEntidadConDocumentacion().then((filtroDocumentacion) => {
            this.filtroDto = filtroDocumentacion;
            this.paginacion.currentPage = 1;
            this.paginacion.pageSize = 10;
            this.limpiarFiltros();
        })
    }
}
    // #endregion