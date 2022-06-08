/**
* @author: pferrer
* @description: Directiva/Componente o como quiera mansilla llamarlo, de tipos de entidades para documentacion
* @type: Controller
**/
import * as angular from 'angular';
import { IAdministradorDocumentoDataService, IAdministradorDocumentoLogicService } from '../../../services'
import { TipoEntidadDocumentoDto, FiltroEntidadDocumentoAsociado, EntidadDocumentacion } from '../../../model';

export class TipoEntidadController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */

    title = {
        name: '',
        icon: ''
    };
    modelValue?: EntidadDocumentacion;

    set model(entidad: EntidadDocumentacion | undefined) {
        this.modelValue = entidad;
        this.codigo = entidad && entidad.Codigo ? entidad.Codigo : this.codigo || '';
        this.nombre = entidad && entidad.Nombre ? entidad.Nombre : '';

        if(entidad && this.tiposEntidad) {
            for (let i = 0; i < this.tiposEntidad.length; i++) {
                if(entidad.IdTipoEntidad === this.tiposEntidad[i].Id){
                    this.tipoEntidadElegida = this.tiposEntidad[i];
                    this.idTipoEntidad = this.tipoEntidadElegida.Id;
                }
            }
        }
    }

    get model(): EntidadDocumentacion | undefined {
        return this.modelValue;
    }

    editable: any;
    idTipoEntidad : any;

    codigo?: string;
    nombre?: string;
    ngDisabled: any = '';
    initTipo : IEntidadDto = {};
    tipoEntidadElegida: TipoEntidadDocumentoDto = {Id : 0};
    tiposEntidad: TipoEntidadDocumentoDto[] = [];
    filtroDto: FiltroEntidadDocumentoAsociado = {};

    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    static $inject: Array<string> = ['Logger', 'AdministradorDocumentoDataService', 'ModalService', 'AdministradorDocumentoLogicService','$scope'];
    constructor(private $log: ILogger, private AdministradorDocumentoDataService: IAdministradorDocumentoDataService, private ModalService : IModalService,
        private AdministradorDocumentoLogicService : IAdministradorDocumentoLogicService, private scope: angular.IScope) {}

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    cargarComboTipos() {
        this.AdministradorDocumentoDataService.TipoEntidadObtenerTodos().then((tiposEntidad) => {
            this.tiposEntidad = tiposEntidad;
            if(this.modelValue && this.modelValue.IdTipoEntidad){
                for (let i = 0; i < this.tiposEntidad.length; i++) {
                    if(this.modelValue.IdTipoEntidad === this.tiposEntidad[i].Id){
                        this.tipoEntidadElegida = this.tiposEntidad[i];
                        this.idTipoEntidad = this.tipoEntidadElegida.Id;
                    }
                }
            }else{
                this.tipoEntidadElegida = this.tiposEntidad[0];
                this.idTipoEntidad = this.tipoEntidadElegida.Id;
            }
        });
    }

    searchEntidades() {
        this.AdministradorDocumentoLogicService.seleccionarTipoEntidad(this.tipoEntidadElegida.Id).then((entidadElegida) => {
            this.model = entidadElegida;
        });
    }

    modalVariosResultados(opciones){
        let options: Array<any> = [];
        for (let i = 0; i < opciones.length; i++) {
            options.push({
                id: opciones[i].Id,
                label: 'Nombre : '+ opciones[i].Nombre
            });
        };
        this.ModalService.selectOptionModal(options).then((opcionElegida) => {
            for (let i = 0; i < opciones.length; i++) {
                if(opciones[i].Id === opcionElegida.id){
                    this.model = opciones[i]
                    break;
                }
            }
        });
    }

    busquedaRapidaEntidad() {
        if (!this.codigo) {
            this.model = undefined;
        }
        else {
            if (this.codigo && !this.nombre) {
                this.filtroDto.Codigo = this.codigo;
                this.filtroDto.Nombre = this.nombre;
                this.filtroDto.IdTipoEntidad = this.tipoEntidadElegida.Id;
                this.AdministradorDocumentoDataService.ObtenerEntidadesPorFiltro(this.filtroDto).then((entidadObtenida) => {
                    if(entidadObtenida.length > 1)
                    {
                        this.modalVariosResultados(entidadObtenida);
                    }
                    else{
                        this.model = entidadObtenida[0];
                    }
                });
            }
        }
    }

    cambioTipoEntidad() {
        this.codigo = '';
        this.model = undefined;
        this.idTipoEntidad = this.tipoEntidadElegida.Id;
    }

    cambioCodigoEntidad() {
        if(this.model){
            if (this.codigo != this.model.Codigo) {
                this.model = undefined;
            }
        }
    }
    
    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    $onInit() {
        this.$log = this.$log.getInstance('TipoEntidadController');
        this.$log.debug('ON');
        this.activate();
    }

    activate() {
        this.cargarComboTipos();
        this.AdministradorDocumentoDataService.ObtenerFiltroEntidadConDocumentacion().then((filtroDocumentacion) => {
            this.filtroDto = filtroDocumentacion;
        })
    }
    // #endregion
}