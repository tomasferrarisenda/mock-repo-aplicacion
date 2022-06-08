/**
* @author: pferrer
* @description: Controller del Edit
* @type: Controller
**/
import * as angular from 'angular';
import { IGrupoPrestacionMedicaDataService } from '../../services';
import { GrupoPrestacionMedicaEditDto, ItemGrupoPrestacionMedicaListDto } from '../../model';
import { IRecursoDataService } from '../../../../../support/basic/services/RecursoDataService';
import { ISucursalDataService } from "../../../../../support/basic/services/SucursalDataService";



export class GrupoPrestacionMedicaEditController implements angular.IController {
    static $inject: Array<string> = ['Logger', 'GrupoPrestacionMedicaDataService', '$q', 'ModalService', 'SucursalDataService', 'AlertaService', 'RecursoDataService', 'SupportDataService', 'PrestacionGestionDataService', 'SupportLogicService'];
    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */

    resolve: any;
    dismiss: any;
    close: any;

    nombre: string = '';
    observaciones: string = '';
    recurso: any;

    sucursales: Array<IEntidadDto> = [];
    sucursalElegida: IEntidadDto = {};

    servicios: Array<IEntidadDto> = [];
    servicioElegido: IEntidadDto = {};

    prestacionMedicaEdit: GrupoPrestacionMedicaEditDto = {};
    tipoDeUnidadRequisito: IEntidadDto[] = [];
    tipoRequisitoElegido: IEntidadDto = {};
    prestacionElegida: any;

    title = {
        name: '',
        icon: ''
    };

    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID

    /**
    * @class GrupoPrestacionMedicaEditController
    * @constructor
    */
    constructor(private $log: ILogger,
        private grupoPrestacionDataService: IGrupoPrestacionMedicaDataService,
        private $q: angular.IQService,
        private ModalService: IModalService,
        private SucursalDataService: ISucursalDataService,
        private AlertaService,
        private RecursoDataService: IRecursoDataService,
        private SupportDataService,
        private PrestacionGestionDataService,
        private SupportLogicService
    ) { }

    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class NameController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */

    cancel() {
        this.dismiss({ $value: 'cancel' });
    }

    guardar() {
        this.prestacionMedicaEdit.IdRecurso = this.recurso ? this.recurso.Id : 0;
        this.prestacionMedicaEdit.IdTipoRecurso = this.recurso ? this.recurso.IdTipoRecurso : 0;
        this.prestacionMedicaEdit.IdServicio = this.servicioElegido.Id;
        this.prestacionMedicaEdit.IdSucursal = this.sucursalElegida.Id;
        this.prestacionMedicaEdit.Nombre = this.nombre;
        this.prestacionMedicaEdit.Observaciones = this.observaciones;

        this.grupoPrestacionDataService.guardar(this.prestacionMedicaEdit).then((result) => {
            if (result.IsOk) {
                this.ModalService.success("Se ha guardado el Grupo de Prestación.")
                this.close({ $value: this.prestacionMedicaEdit });
            }
            else {
                this.ModalService.warning("Verifique por favor." + result.Message);
            }
        });

    }

    eliminarPrestacion(index) {
        if (this.prestacionMedicaEdit.Items) this.prestacionMedicaEdit.Items.splice(index, 1);
    }

    agregarPrestacion() {
        this.SupportDataService.entidadesBuscador = this.PrestacionGestionDataService.ObtenerPrestacionesDelServicioSucursalActivos(
            this.servicioElegido && this.servicioElegido.Id ? this.servicioElegido.Id : 0,
            this.sucursalElegida && this.sucursalElegida.Id ? this.sucursalElegida.Id : 0);
        this.SupportDataService.tituloBuscador = 'Seleccionar Prestación';
        this.SupportDataService.mostrarIdBuscador = true;
        this.SupportDataService.mostrarCodigoBuscador = false;
        this.SupportDataService.mostrarNombreBuscador = true;
        this.SupportDataService.mostrarDescripcionBuscador = false;
        this.SupportDataService.tituloIdBuscador = 'Código';
        this.SupportDataService.tituloCodigoBuscador = '';
        this.SupportDataService.tituloNombreBuscador = 'Nombre';
        this.SupportDataService.tituloDescripcionBuscador = '';
        this.SupportLogicService.openSelectorBase().then((prestacionElegida) => {
            if (this.prestacionMedicaEdit.Items && this.prestacionMedicaEdit.Items.find(x => x.IdPrestacionMedica === prestacionElegida.Id)) {
                this.AlertaService.NewWarning("Esta prestación ya se encuentra asignada.");
            } else {
                var prestacion: ItemGrupoPrestacionMedicaListDto = { Id: 0 };
                prestacion.IdPrestacionMedica = prestacionElegida.Id
                prestacion.NombrePrestacionMedica = prestacionElegida.Nombre
                if (this.prestacionMedicaEdit && this.prestacionMedicaEdit.Items) this.prestacionMedicaEdit.Items.push(prestacion);
                this.borrarPrestacion();
            }
        });
    }

    borrarPrestacion() {
        this.prestacionElegida = {};
    }

    $onInit() {
        this.$log = this.$log.getInstance('GrupoPrestacionMedicaEditController');
        this.$log.debug('ON');

        this.activate()
    }
    // #endregion

    activate() {
        this.title.name = this.resolve.idGrupo ? 'Modificar Grupo de Prestación' : 'Nuevo Grupo de Prestación';
        this.title.icon = this.resolve.idGrupo ? 'EDIT' : 'NEW';

        this.obtenerUnidadDto().then((unidad) => {
            this.prestacionMedicaEdit = unidad;

            this.nombre = this.prestacionMedicaEdit && this.prestacionMedicaEdit.Nombre ? this.prestacionMedicaEdit.Nombre : '';
            this.observaciones = this.prestacionMedicaEdit && this.prestacionMedicaEdit.Observaciones ? this.prestacionMedicaEdit.Observaciones : '';

            this.RecursoDataService.obtenerRecursoPorId(
                this.prestacionMedicaEdit && this.prestacionMedicaEdit.IdTipoRecurso ? this.prestacionMedicaEdit.IdTipoRecurso : 0,
                this.prestacionMedicaEdit && this.prestacionMedicaEdit.IdRecurso ? this.prestacionMedicaEdit.IdRecurso : 0).then((recurso) => {
                    this.recurso = recurso;
                });

            this.grupoPrestacionDataService.ObtenerTodosServicios().then((servicios) => {
                this.servicios = servicios;
                this.servicioElegido = this.servicios[0];
                this.title.icon = this.resolve.idGrupo ? 'EDIT' : 'NEW';
                for (let i = 0; i < this.servicios.length; i++) {
                    if (this.resolve.idGrupo) {
                        // Si es edicion, elige el servicio a editar. Si no es edicion y desde el filtro anterior estaba cargado, se busca
                        // ese servicio para elegirlo por defecto.
                        if (this.servicios[i].Id === this.prestacionMedicaEdit.IdServicio) {
                            this.servicioElegido = this.servicios[i];
                            break;
                        }
                    }
                    else {
                        if (this.servicios[i].Id === this.resolve.idServicio) {
                            this.servicioElegido = this.servicios[i];
                            break;
                        }
                    }
                }
            });

            this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
                this.sucursales = sucursales;
                for (let i = 0; i < this.sucursales.length; i++) {
                    if (this.sucursales[i].Id === this.prestacionMedicaEdit.IdSucursal) {
                        this.sucursalElegida = this.sucursales[i];
                        break;
                    }
                }
            });
        });
    }

    obtenerUnidadDto() {
        var def = this.$q.defer();
        if (this.resolve.idGrupo) {
            this.grupoPrestacionDataService.getOne(this.resolve.idGrupo).then((unidad) => {
                def.resolve(unidad);
            });
        }
        else {
            this.grupoPrestacionDataService.nuevo().then((unidad) => {
                def.resolve(unidad);
            });
        }
        return def.promise;
    }
}