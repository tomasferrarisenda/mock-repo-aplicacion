/**
* @author: aminoldo
* @description: Directiva/Componente o como quiera mansilla llamarlo, de tipos de entidades para documentacion
* @type: Controller
**/
import * as angular from 'angular';
import { IOrganizacionDataService } from './../../../services';
import { ISupportDataService } from '../../../../../../../allendeModules/support/basic/services';
import SupportLogicService from '../../../../../../../allendeModules/support/basic/services/SupportLogicService';


export class OrganizacionSelectorController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */

    modelValue?: any;

    set model(entidad: any | undefined) {
        this.modelValue = entidad;
        // this.model = entidad ? entidad : null;
        this.codigo = entidad && entidad.Codigo ? entidad.Codigo : this.codigo || '';
        this.nombre = entidad && entidad.Nombre ? entidad.Nombre : '';
    }

    get model(): any | undefined {
        return this.modelValue;
    }

    codigo?: number;
    nombre?: string;
    codigoOrganizacion;

    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    static $inject: Array<string> = ['Logger', 'OrganizacionDataService', 'SupportDataService', 'SupportLogicService', 'ModalService', '$scope'];
    constructor(private $log: ILogger,
        private OrganizacionDataService: IOrganizacionDataService,
        private SupportDataService: ISupportDataService,
        private SupportLogicService,
        private ModalService: IModalService,
        private scope: angular.IScope) { }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    searchOrganizacion() {
        this.SupportDataService.entidadesBuscador = this.OrganizacionDataService.getAllOrganizacionParaBusqueda();
        this.SupportDataService.tituloBuscador = 'Seleccionar Organización';
        this.SupportDataService.mostrarIdBuscador = false;
        this.SupportDataService.mostrarCodigoBuscador = true;
        this.SupportDataService.mostrarNombreBuscador = true;
        this.SupportDataService.mostrarDescripcionBuscador = false;
        this.SupportDataService.tituloIdBuscador = '';
        this.SupportDataService.tituloCodigoBuscador = 'Código';
        this.SupportDataService.tituloNombreBuscador = 'Organización';
        this.SupportDataService.tituloDescripcionBuscador = '';
        this.SupportLogicService.openSelectorBase()
            .then((result) => {
                this.model = result;
            });

    }

    busquedaRapidaOrganizacion() {
        if (!this.codigo) {
            this.model = undefined;
        }
        else {
            if (this.codigo && !this.nombre) {
                this.OrganizacionDataService.GetByCodigo(this.codigo).then((organizacionObtenida) => {
                    this.model = organizacionObtenida;
                });
            }
        }
    }

    cambioCodigoOrganizacion() {
        if (this.model) {
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
        if (this.codigoOrganizacion){
            this.OrganizacionDataService.GetByCodigo(this.codigoOrganizacion).then((organizacionObtenida) => {
                this.model = organizacionObtenida;
            });
        }

    }
    // #endregion
}