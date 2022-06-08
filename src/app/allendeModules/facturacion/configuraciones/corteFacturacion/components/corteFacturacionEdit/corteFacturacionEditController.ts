/**
* @author: crusso
* @description: Corte Facturacion Edit Controller
* @type: Controller
**/
import * as angular from 'angular';
import { ISupportDataService } from "../../../../../support/basic/services";
import { ISucursalDataService } from "../../../../../support/basic/services/SucursalDataService";
import { ICorteFacturacionDataService } from "../../services"
import { TecnicoDelServicioDTO } from '../../../../../profesionales/tecnicoDelServicio/model';
import { filtroCorteFacturacionDTO } from '../../model';
import { corteFacturacionDTO } from '../../model/corteFacturacionDto';
import { Meses } from '../../config/mesesConstant';
import { EntidadDocumentacion } from '../../../../../basicos/documentos/model';
 
export class corteFacturacionEditController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };

    resolve: any;
    dismiss: any;
    close: any;

    // mas propiedades ..
    corteFacturacion: corteFacturacionDTO = {};
    mesElegido: IEntidadDto = {};
    meses: IEntidadDto [] = [];
    anio: number = 0;
    fechaCorte: Date = new Date();
    listadoServicio: IEntidadDto[] = [];
    servicioElegido: IEntidadDto = {};
    sucursalServicio: IEntidadDto[] = [];
    sucursalElegida: IEntidadDto = {};
    startDate : Date = new Date('1900-01-01');
    //Para Guardar información //

    data = {
        corteFacturacion: [],
        corteEdit: {}
    };


    // #endregion

    // ID
    static $inject: Array<string> = ['Logger', 'SupportDataService', 'SucursalDataService', 'CorteFacturacionDataService', 'ModalService', '$q', 'DateUtils'];
    /**
    * @class corteFacturacionEditController
    * @constructor
    */
    constructor(
        private $log: ILogger,
        private SupportDataService: ISupportDataService,
        private SucursalDataService: ISucursalDataService,
        private CorteFacturacionDataService: ICorteFacturacionDataService,
        private ModalService: IModalService,
        private $q: angular.IQService,
        private DateUtils: IDateUtils //Se utiliza de esta manera para colocar los Años.
    ) {
    }


    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    cancel() {
        this.dismiss({ $value: 'cancel' });
    }

    guardar() {
        //Cuando no trae Valor es Nuevo sino Editar
        this.corteFacturacion.Mes = (this.mesElegido && this.mesElegido.Id) ? this.mesElegido.Id : 0;
        this.corteFacturacion.Fecha = this.DateUtils.parseToBe(this.fechaCorte);
        this.corteFacturacion.IdServicio = (this.servicioElegido && this.servicioElegido.Id) ? this.servicioElegido.Id : 0;
        this.corteFacturacion.IdSucursal = (this.sucursalElegida && this.sucursalElegida.Id) ? this.sucursalElegida.Id : 0;

        this.CorteFacturacionDataService.guardar(this.corteFacturacion).then((result) => {
            if (result.IsOk) {
                this.ModalService.success("Se ha guardado la Fecha de Corte de Facturación.");
                this.close();
            }
            else {
                this.ModalService.warning("Verifique por favor. " + result.Message);
            }
        });
    }



    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class corteFacturacionEditController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {
        this.$log = this.$log.getInstance('corteFacturacionEditController');
        this.$log.debug('ON');
        this.activate();
    }

    activate() {
        // console.log("Muestro el Id:", this.resolve.idCorteFacturacion);
        this.title.name = this.resolve.idCorteFacturacion ? 'Modificar Fecha de Corte Facturación' : 'Nuevo Fecha de Corte Facturación';
        this.title.icon = this.resolve.idCorteFacturacion ? 'EDIT' : 'NEW';


        this.obtenerCorteFacturacion().then((corte) => {
            //llamo los datos en el input nombre
            this.corteFacturacion = corte;
            this.fechaCorte = this.resolve.idCorteFacturacion ? this.DateUtils.parseToFe(this.corteFacturacion.Fecha) : new Date(); // Estamos tomando la Fecha del OBjeto obtenido de BK y realizamos un Parseo.



            //Editar el listado de los Meses
			this.meses = Meses;
            this.mesElegido = this.meses[0];

            for (let i = 0; i < this.meses.length; i++) {
                if (this.meses[i].Id === this.corteFacturacion.Mes) {
                    this.mesElegido = this.meses[i];
                    break;
                }
            }

            //Editar el año el mismo lo trae, corroborar si esta bien con Pedro!

            this.corteFacturacion.Anio = this.resolve.idCorteFacturacion ? this.corteFacturacion.Anio : new Date().getFullYear(); // Se agrega el valor del año porque NO trae ningun dato.

            //Trae los Todos los Servicios
            this.SupportDataService.getAllServicioMedico().then((servicios) => {
                this.listadoServicio = servicios;

                for (let i = 0; i < this.listadoServicio.length; i++) { 
                    if (this.listadoServicio[i].Id === this.corteFacturacion.IdServicio) {
                        this.servicioElegido = this.listadoServicio[i];
                        break;
                    }
                }
            });

            //Trae las Sucursales 
            this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
                this.sucursalServicio = sucursales;

                for (let i = 0; i < this.sucursalServicio.length; i++) {
                    if (this.sucursalServicio[i].Id === this.corteFacturacion.IdSucursal) {
                        this.sucursalElegida = this.sucursalServicio[i];
                        break;
                    }
                }
            });
        });
    }

    obtenerCorteFacturacion() {
        var def = this.$q.defer();
        //Si trae Datos es para modificarlo
        if (this.resolve.idCorteFacturacion) {
            this.CorteFacturacionDataService.getOne(this.resolve.idCorteFacturacion).then((corteFacturacion) => {
                def.resolve(corteFacturacion);
            });
        }

        //Si no trae ningun Dato entonces es para agregar.
        else {
            this.CorteFacturacionDataService.nuevoCorteFacturacion().then((corteFacturacion) => {
                def.resolve(corteFacturacion);
            });
        }
        return def.promise;
    }
    // #endregion
}