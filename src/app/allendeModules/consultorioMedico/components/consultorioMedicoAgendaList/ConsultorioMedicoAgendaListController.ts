/**
 * @author: ppautasso
 * @description: controller para la lista del consultorio medico con agenda
 * @type: Controller
 **/
import * as angular from 'angular';
import {
    IDisponibilidadDeTurnosDataService
} from '../../../turnos/common/services/DisponibilidadDeTurnosDataService';
import {
    IProfesionalesDataService
} from '../../../profesionales';
import {
    IConsultorioMedicoStorageHelperService, IAgendaVisualizableDataService, IIngresoHceDataService, IConsultorioMedicoLogicService, IConsultorioDataService
} from '../../services';
import {
    ICredentialsDataService
} from 'core/security';
import { IIngresoHCEDto, IConsultorioViewDto } from '../../models/dtos';

export class ConsultorioMedicoAgendaListController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };
    // mas propiedades ..
    loading: boolean = false;
    infoUser;
    fecha = new Date();

    estadosDeTurnos: any;
    tiposDeTurnos: any;

    recurso;
    servicio;
    serviciosList;
    usuario;
    profesional;

    turnosPorRecurso;

    horarioRecepcionCheck: boolean = false;
    fechaAsignacionCheck: boolean = false;
    situacionConfirmacionCheck: boolean = false;
    situacionLlamadaCheck: boolean = false;
    mutualRecepcionCheck: boolean = false;
    obtenerCancelados: boolean = false;

    menuOptions;
    filterBuscarPaciente;

    timeoutId;

    sucursal;
    sucursalesList;

    relacionSucursalServicioJefe;
    relacionesSucServJefeList;

    agendasVisualizables;
    agendaVisualizada;

    //profesional en uso
    profesionalEnUso;

    //recursos que tiene el profesional compartiendo y que puede utilizar
    recursosCompartidosPorElProfesional;

    // bandera para menejo de agenda
    manejoAgenda = true;

    columnasNumber: number = 1;

    optionsObj = {
        ok: 'Si',
        cancel: 'No'
    };

    //boolean es dia feriado
    esDiaFeriado: any;

    //consultorio
    consultorio: IConsultorioViewDto = {};
    salasEspera;
    //Storage variables
    storageKeys = {
        keyConsultorioMedico: "consultorio-medico-data",
        keyHistoriaClinica: 'hcedata'
    }

    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = [
        'Logger',
        '$q',
        '$state',
        'CredentialsDataService',
        'moment',
        'AlertaService',
        'TurnoDataService',
        'PlantillaDataService',
        'DisponibilidadDeTurnosDataService',
        'TurnosLogicService',
        'TurnosCommonLogicService',
        'RecepcionTurnosLogicService',
        'UsuarioGestionDataService',
        'ProfesionalesDataService',
        'ServiciosGestionDataService',
        'ModalService',
        'ConsultorioMedicoStorageHelperService',
        'PlantillaLogicService',
        'MantenimientoAgendaDataService',
        'SucursalDataService',
        'ENV',
        '$rootScope',
        'StorageService',
        'AgendaVisualizableDataService',
        'IngresoHceDataService',
        'SupportLogicService',
        'ConsultorioMedicoLogicService',
        'ConsultorioDataService',
        'SupportDataService'
    ];
    /**
     * @class ConsultorioMedicoAgendaListController
     * @constructor
     */
    constructor(private $log: ILogger,
        private $q,
        private $state,
        private CredentialsDataService: ICredentialsDataService,
        private moment,
        private AlertaService: IAlertaService,
        private TurnoDataService,
        private PlantillaDataService,
        private DisponibilidadDeTurnosDataService: IDisponibilidadDeTurnosDataService,
        private TurnosLogicService,
        private TurnosCommonLogicService,
        private RecepcionTurnosLogicService,
        private UsuarioGestionDataService,
        private ProfesionalesDataService: IProfesionalesDataService,
        private ServiciosGestionDataService,
        private ModalService,
        private StorageService: IConsultorioMedicoStorageHelperService,
        private PlantillaLogicService,
        private MantenimientoAgendaDataService,
        private SucursalDataService,
        private ENV,
        private $rootScope,
        private _storage,
        private AgendaVisualizableDataService: IAgendaVisualizableDataService,
        private ingresoHCEDataService: IIngresoHceDataService,
        private SupportLogicService,
        private consultorioMedicoLogic: IConsultorioMedicoLogicService,
        private consultorioDataService: IConsultorioDataService,
        private supportDataService) { }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
    buscar(profesional) {
        //seteo la promesa
        let def = this.$q.defer();

        let _pSucursal = (this.relacionSucursalServicioJefe) ? this.relacionSucursalServicioJefe.IdSucursal : 0;
        let _pIdRecurso = (profesional) ? profesional.Id : this.profesional.Id;
        // siempre va a ser un profesional, seteo 1 en tipo de recurso
        let _pIdTipoRecurso = (profesional) ? profesional.IdTipoRecurso : this.profesional.IdTipoRecurso;
        let _pIdServicio = (this.relacionSucursalServicioJefe) ? this.relacionSucursalServicioJefe.IdServicio : 0;

        let _pFecha;
        if (this.existStorage()) {
            this.getStoredData();
        }
        _pFecha = this.moment(this.fecha).format("MM-DD-YYYY");


        if (!_pSucursal) {
            this.AlertaService.NewWarning("Debe seleccionar una sucursal");
            return;
        }

        if (!_pIdRecurso) {
            this.AlertaService.NewWarning("Atención", "El usuario logueado no es un profesional, o no tiene un profesional asociado");
            return;
        }

        this.loading = true;

        this.DisponibilidadDeTurnosDataService.obtenerTurnosPorRecursoParaAgendaConsultorio(_pIdRecurso, _pIdTipoRecurso, _pIdServicio, _pSucursal,
            _pFecha, this.obtenerCancelados, this.horarioRecepcionCheck, this.fechaAsignacionCheck, this.situacionConfirmacionCheck, this.mutualRecepcionCheck)
            .then((pResult) => {
                this.$log.debug('pResult', pResult);
                if (pResult && pResult.length) {
                    this.turnosPorRecurso = this.setearData(pResult);
                    this.$log.debug('turnosPorRecurso', this.turnosPorRecurso);
                    def.resolve(true);

                } else {
                    //this.AlertaService.NewWarning("Atención", "No existen turnos para la busqueda seleciconada");
                    //this.setTitle("SIN TURNOS EN EL DIA ");
                    def.resolve(false);
                    this.limpiarData();
                }
                this.loading = false;

            }, (pError) => {
                this.$log.error('pError', pError);
                this.loading = false;
                def.reject(pError);
            });
        return def.promise;
    }

    buscarServiciosSucursalRelacionPorProfesional() {
        let def = this.$q.defer();

        this.loading = true;
        let _recurso = {
            Id: this.profesional.Id,
            IdTipo: 1
        }
        this.ServiciosGestionDataService.obtenerPorRecursoRelacionSucursalServicio(_recurso)
            .then((pResult) => {
                this.$log.debug('pResult obtenerPorRecurso', pResult);
                def.resolve(pResult);
            }, (pError) => {
                this.$log.error('pError obtenerPorRecurso', pError);
                def.reject(pError);
            });

        return def.promise;

    }

    cambiarSucursalServicioSelect() {
        if (this.relacionSucursalServicioJefe.IdProfesionalJefeServicio == this.profesional.Id) {
            this.$log.debug('El profesional es jefe de servicio');
            this.profesional.jefeServicio = true;
        } else {
            this.$log.debug('El profesional NO es jefe de servicio');
            this.profesional.jefeServicio = false;
        }
        this.onReady();
    }



    obtenerSucursalesPorServicioYRecurso() {
        let def = this.$q.defer();
        this.SucursalDataService.obtenerSucursalXRecursoXServicio(this.profesional.Id, this.profesional.IdTipoRecurso, this.servicio.Id)
            .then((pResult) => {
                this.$log.debug('pResult', pResult);
                def.resolve(pResult);
            }, (pError) => {
                this.$log.error('pError', pError);
                def.reject(pError);
            });

        return def.promise;
    }

    // #endregion


    // #region /* ----------------------------------------- SUPPORT ------------------------------------------ */

    recargar() {
        //this.buscar(this.profesional);
    }

    setearData(data) {
        if (data && data.length) {
            for (let index = 0; index < data.length; index++) {
                // pTurnos[index].SobreTurno = (pTurnos[index].EsSobreTurno) ? "SI" : "NO";
                data[index].Estado = (this.estadosDeTurnos.find(x => x.Id === data[index].IdEstado).Nombre) || "LIBRE";
                data[index].TipoTurno = (this.tiposDeTurnos.find(x => x.Id === data[index].IdTipoTurno).Nombre) || "";
                data[index].EstadoColor = (this.estadosDeTurnos.find(x => x.Id === data[index].IdEstado).Color) || "";
                data[index].MutualYPlanFacturado = (data[index].MutualYPlanFacturado) ? data[index].MutualYPlanFacturado : "-"
                data[index].IdRow = angular.copy(index);

            }

            data.forEach(turno => {
                if (turno.IdTipoTurno === 4) {
                    turno.EstadoColor = 'color-violeta-turno-reservado';
                }
                if (turno.IdEstado === 8) {
                    turno.DemoraEnSala = "";
                    turno.FechaAsignacion = "";
                    turno.DiasDemora = "";
                } else {
                    turno.DemoraEnSala = turno.DemoraEnSala + " min.";
                }
            });
        }
        return data;
    }

    setTitle(titulo) {
        this.title.name = titulo;
    }

    limpiarData() {
        this.setTitle("SIN TURNOS");
        delete this.turnosPorRecurso;
    }

    setVistaColumnas(item) {

        if (item) {
          
            if (this.fechaAsignacionCheck) {
                this.columnasNumber = this.columnasNumber + 1;
                return;
            }
            if (this.situacionConfirmacionCheck) {
                this.columnasNumber = this.columnasNumber + 1;
                return;
            }
     
           
        } else {
          
            if (this.fechaAsignacionCheck) {
                this.columnasNumber = this.columnasNumber - 1;
                return;
            }
            if (this.situacionConfirmacionCheck) {
                this.columnasNumber = this.columnasNumber - 1;
                return;
            }
   
            if (this.columnasNumber == 2) this.columnasNumber = 1;
        }

    }

    getInfoEstadoCobranza(item) {
        let str = '';
        switch (item.IdEstadoCobranzaCaja) {
            case 1:
                str = "El paciente no debe abonar un importe en caja, lo cubre el financiador";
                break;
            case 2:
                str = "El paciente debe abonar un importe en caja, pero todavía no ha efectuado el pago";
                break;
            case 3:
                str = "El paciente debe abonar un importe en caja y ya pagó (manual)";
                break;
            case 4:
                str = "El paciente debe abonar un importe, fue enviado el registro a la caja";
                break;
            case 5:
                str = "El paciente debe abonar un importe en caja, y ya pagó";
                break;

        }

        if (item.ImporteParticular) {
            str = str + " Importe: $" + item.ImporteParticular;
        }
        return str;
    }

    getInfoEstadoAutorizacion(item) {
        let str = '';
        switch (item.IdEstadoAutorizacion) {
            case 1:
                str = "";
                break;
            case 2:
                str = "No autorizado";
                break;
            case 0:
                str = "";
                break;
        }

        return str;
    }

    verAgendaMedico() {

        //ver la agenda medica tenemos varias posibilidades
        //modo comun, No soy jefe de servicio ni tengo agendas visualizables
        if (this.agendasVisualizables && this.agendasVisualizables.length == 0) {

            let servicio = {
                Id: this.relacionSucursalServicioJefe.IdServicio
            }

            this.PlantillaLogicService.viewPlantilla(0, servicio, {
                Id: this.profesional.Id,
                IdTipoRecurso: this.profesional.IdTipoRecurso,
                Nombre: this.profesional.Nombre + " " + this.profesional.Apellido
            });
        } else if (this.agendasVisualizables && this.agendasVisualizables.length) {
            let servicio = {
                Id: this.relacionSucursalServicioJefe.IdServicio
            }

            this.PlantillaLogicService.viewPlantilla(0, servicio, {
                Id: this.agendaVisualizada.IdRecurso,
                IdTipoRecurso: this.agendaVisualizada.IdTipoRecurso,
                Nombre: this.agendaVisualizada.Recurso
            });
        }

    }

    verCalendarioRecurso() {

        // voy a ver el calendario de un recurso en particular
        this.$log.debug('verCalendrioRecurso');
        var servicio;
        var recurso;
        var sucursal;
        if (this.agendasVisualizables && this.agendasVisualizables.length == 0) {

            servicio = {
                Id: this.relacionSucursalServicioJefe.IdServicio,
                Nombre: this.relacionSucursalServicioJefe.Servicio
            };

            recurso = this.profesional;
            recurso.Nombre = recurso.Nombre + ' ' + this.profesional.Apellido;
            sucursal = {
                Id: this.relacionSucursalServicioJefe.IdSucursal,
                Nombre: this.relacionSucursalServicioJefe.Sucursal
            };


        } else if (this.agendasVisualizables && this.agendasVisualizables.length) {
            servicio = {
                Id: this.relacionSucursalServicioJefe.IdServicio,
                Nombre: this.relacionSucursalServicioJefe.Servicio
            };

            recurso = {
                Id: this.agendaVisualizada.IdRecurso,
                IdTipoRecurso: this.agendaVisualizada.IdTipoRecurso,
                Nombre: this.agendaVisualizada.Recurso
            }

            sucursal = {
                Id: this.relacionSucursalServicioJefe.IdSucursal,
                Nombre: this.relacionSucursalServicioJefe.Sucursal
            };
        }

        this.TurnosCommonLogicService.openCalendarioTurnosPorRecurso(recurso, servicio, sucursal, true)
            .then((pResultDiaSeleccionado) => {
                this.$log.debug('pResultDiaSeleccionado', pResultDiaSeleccionado);

                delete this.fecha;
                setTimeout(() => {
                    this.fecha = angular.copy(pResultDiaSeleccionado.toDate());
                    this.changeFecha();
                }, 700);

            }, (pError) => {
                this.$log.error('pError', pError);
            });


    }
    // #endregion

    // #region /* ------------------------------------------ EVENTOS ----------------------------------------- */

    /**
     * @class ConsultorioMedicoAgendaListController
     * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
     * @event
     */
    $onInit() {
        this.$log = this.$log.getInstance('ConsultorioMedicoAgendaListController');
        this.$log.debug('ON');

        // voy a obtener los datos del usuario
        // DEPRECATED -> se reemplaza por la obtencion de las sucursales por servicio y recurso
        this.infoUser = this.CredentialsDataService.GetForce();
        // this.$log.debug('infoUser', this.infoUser);

        this.sucursalesList = angular.copy(this.infoUser.sucursales);
        if (this.sucursalesList && this.sucursalesList.length)
            this.sucursal = angular.copy(this.sucursalesList[0]);

        // obtengo idProfesional por Id de usuario => this.infoUser.id

        this.loading = true;

        var _usuario = this.UsuarioGestionDataService.obtenerParaEditar(this.infoUser.id);
        var _estadosDeTurnos = this.TurnoDataService.obtenerTiposEstadoTurnos();
        var _tiposDeTurnos = this.PlantillaDataService.obtenerTiposDeTurnos();

        this.$q.all([
            _usuario,
            _estadosDeTurnos,
            _tiposDeTurnos,
        ]).then((pResults) => {

            this.$log.debug('obteniendo resultados onInit', pResults);
            this.usuario = pResults[0];
            this.estadosDeTurnos = pResults[1];
            this.tiposDeTurnos = pResults[2];
            this.loading = false;

            // tengo el USUARIO, SUCURSAL => obtengo profesional y servicios del profesional
            this.loading = true;
            this.ProfesionalesDataService.ObtenerProfesionalParaEdicion(this.usuario.IdProfesional)
                .then((pResult) => {
                    this.$log.debug('pResultObtenerProfesional', pResult);
                    this.loading = false;

                    this.profesional = pResult;

                    if (this.profesional && this.profesional.Id) {
                        // tengo que buscar servicios por profesional
                        this.buscarServiciosSucursalRelacionPorProfesional()
                            .then((pResultServiciosSucursalRelacionPorProfesional) => {
                                this.$log.debug('pResultServiciosSucursalRelacionPorProfesional', pResultServiciosSucursalRelacionPorProfesional);
                                this.relacionesSucServJefeList = pResultServiciosSucursalRelacionPorProfesional;

                                if (this.relacionesSucServJefeList && this.relacionesSucServJefeList.length) {
                                    this.relacionSucursalServicioJefe = this.relacionesSucServJefeList[0];
                                    //consulto si es jefe del servicio y habilito bandera de jefe servicio
                                    if (this.relacionSucursalServicioJefe.IdProfesionalJefeServicio == this.profesional.Id) {
                                        this.$log.debug('El profesional es jefe de servicio');
                                        this.profesional.jefeServicio = true;
                                        //si es jefe de servicio deberia obtener los recursos compartidos con jefeServicio = false
                                        this.buscarAgendasVisualizables(false)
                                            .then((pResult) => {
                                                this.$log.debug('pResult', pResult);
                                                this.recursosCompartidosPorElProfesional = pResult;
                                            }, (pError) => {
                                                this.$log.error('pError', pError);
                                            });
                                    } else {
                                        this.profesional.jefeServicio = false;
                                        // no soy jefe de servicio pero tengo que buscar recursos compartidos igualmente
                                        // lo hago en on ready
                                    }
                                    this.onReady();
                                }

                            }, (pError) => {
                                this.$log.error('pErrorServiciosPorProfesional', pError);
                            });
                    } else {
                        this.AlertaService.NewWarning("No existe un profesional asociado al usuario");
                    }

                }, (pError) => {
                    this.$log.error('pErrorObtenerProfesional', pError);
                    this.loading = false;
                });


        }, (pError) => {
            this.$log.error('Error onInit', pError);
            this.loading = false;
        });
    }

    //metodo ejecutado solo al principio para busqueda automatica
    onReady() {
        // voy a buscar los turnos
        this.buscar(this.profesional)
            .then((pResultBuscar) => {
                this.$log.debug('pResultonReadyBuscar', pResultBuscar);

                if (pResultBuscar) {
                    //tengo turnos en la busqueda entonces seteo titulo
                    if (this.profesional.jefeServicio) {
                        this.setTitle("TURNOS DE " + this.profesional.Apellido + ", " + this.profesional.Nombre + " || " +
                            this.relacionSucursalServicioJefe.Servicio + " - " + this.relacionSucursalServicioJefe.Sucursal + " - <b>JEFE SERVICIO</b>"
                            + " || " + this.moment(this.fecha).format("dddd, D [de] MMMM [de] YYYY"));
                    } else {
                        this.setTitle("TURNOS DE " + this.profesional.Apellido + ", " + this.profesional.Nombre + " || " +
                            this.relacionSucursalServicioJefe.Servicio + " || " +
                            this.relacionSucursalServicioJefe.Sucursal + " || " + this.moment(this.fecha).format("dddd, D [de] MMMM [de] YYYY"));
                    }
                } else {
                    this.setTitle("SIN TURNOS EN EL DIA SELECCIONADO PARA " + this.profesional.Apellido + ", " + this.profesional.Nombre);
                }
                //voy a buscar las  AgendaVisualizables
                this.buscarAgendasVisualizables(this.profesional.jefeServicio)
                    .then((pResultAgendasVisualizables) => {
                        this.$log.debug('pResultAgendasVisualizables', pResultAgendasVisualizables);
                        this.agendasVisualizables = pResultAgendasVisualizables;
                        if (this.agendasVisualizables && this.agendasVisualizables.length)
                            //tengo agendas visualizables
                            //consulto si no es jefe de servicio
                            if (!this.profesional.jefeServicio) {
                                //si no es jefe servicio y tiene agendas visualizables, debo agregar una agenda visualizable propia
                                this.agendasVisualizables.unshift({
                                    IdRecurso: this.profesional.Id,
                                    IdTipoRecurso: this.profesional.IdTipoRecurso,
                                    Recurso: this.profesional.Apellido + ' ' + this.profesional.Nombre
                                })
                            }
                        
                        this.agendaVisualizada = this.agendasVisualizables.find(x => x.IdRecurso == this.profesional.Id);

                        //una vez que tengo la agenda visualizable por defecto en el onready
                        // tengo que buscar el consultorio
                        this.buscarSetearConsultorio();
                    }, (pError) => {
                        this.$log.error('pError', pError);
                    });


            }, (pError) => {
                this.$log.error('pErroronReady', pError);
            });

        // seteo autoresfresco => se comenta hasta mejorar uso
        //this.setElementWrapper();
        // seteo menu contextual
        this.inicializarMenuOptions();
    }

    buscarSetearConsultorio() { 
        //voy a buscar el consultorio por defecto
        this.consultorioDataService.proponerConsultorioAUsuario(this.relacionSucursalServicioJefe.IdServicio, this.relacionSucursalServicioJefe.IdSucursal)
        .then( (pResultConsultorio) => {
            this.$log.debug('pResultConsultorio', pResultConsultorio);
            this.consultorio = pResultConsultorio;
        }, (pError) => {
            this.$log.error('pError',pError);
        });
    }

    editarConsultorio() {
        this.consultorioMedicoLogic.openSeleccionarConsultorioMedico(this.relacionSucursalServicioJefe.IdSucursal)
        .then( (resultConsultorioSeleccionado) => {
            this.$log.debug('resultConsultorioSeleccionado', resultConsultorioSeleccionado);
            this.consultorio = angular.copy(resultConsultorioSeleccionado);
        }, (pError) => {
            this.$log.error('pError',pError);
        });
    }


    esFechaHoy() { 
        let ret = false;
        if (this.moment().format("DD/MM/YYYY") == this.moment(this.fecha).format("DD/MM/YYYY")) { 
            ret = true;
        }
        return ret;
    }


    buscarAgendasVisualizables(esJefeServicio: boolean) {
        this.loading = true;

        let def = this.$q.defer();

        this.AgendaVisualizableDataService.obtenerPorProfesionalServicioSucursal(this.profesional.Id, this.relacionSucursalServicioJefe.IdServicio,
            this.relacionSucursalServicioJefe.IdSucursal, esJefeServicio)
            .then((pResultBuscarAgendasVisualizables) => {
                this.$log.debug('pResultBuscarAgendasVisualizables', pResultBuscarAgendasVisualizables);
                def.resolve(pResultBuscarAgendasVisualizables);

                this.loading = false;
            }, (pErrorBuscarAgendasVisualizabels) => {
                this.$log.error('pErrorBuscarAgendasVisualizabels', pErrorBuscarAgendasVisualizabels);
                this.loading = false;
                def.reject(pErrorBuscarAgendasVisualizabels);
            });

        return def.promise;
    }

    changeAgendaVisualizable() {

        // cambie la agenda visualizable 
        // consulto si estoy consultando la agenda del profesional/usuario
        if (this.profesional.Id == this.agendaVisualizada.IdRecurso) {
            //estoy viendo la agneda del profesional/usuario
            //habilito toda la edicion
            this.manejoAgenda = true;
        } else {
            //no habilito la agenda porque no es el profesional habilitado
            //pero puedo tener recursos compartidos como un equipo, donde tengo que ver la agenda
            //ademas, en el caso que no sea jefe de servicio, si tengo recursos compartidos son accesibles porque son agendas compartidas
            if (!this.profesional.jefeServicio) {
                this.manejoAgenda = true;
            } else {
                if (this.recursosCompartidosPorElProfesional && this.recursosCompartidosPorElProfesional.find(x => x.IdRecurso === this.agendaVisualizada.IdRecurso))
                    this.manejoAgenda = true;
                else
                    this.manejoAgenda = false;
            }

        }

        this.agendaVisualizada.Id = this.agendaVisualizada.IdRecurso;
        this.buscar(this.agendaVisualizada)
            .then((pResultBuscar) => {
                this.$log.debug('pResultBuscar', pResultBuscar);
                if (pResultBuscar) {
                    if (this.profesional.jefeServicio && (this.profesional.Id == this.agendaVisualizada.IdRecurso)) {
                        this.setTitle("TURNOS DE " + this.agendaVisualizada.Recurso + " || " +
                            this.relacionSucursalServicioJefe.Servicio + " - " + this.relacionSucursalServicioJefe.Sucursal + " - <b>JEFE SERVICIO</b>"
                            + " || " + this.moment(this.fecha).format("dddd, D [de] MMMM [de] YYYY"));
                    } else if (this.profesional.Id == this.agendaVisualizada.IdRecurso) {
                        this.setTitle("TURNOS DE " + this.agendaVisualizada.Recurso + " || " +
                            this.relacionSucursalServicioJefe.Servicio + " - " + this.relacionSucursalServicioJefe.Sucursal
                            + " || " + this.moment(this.fecha).format("dddd, D [de] MMMM [de] YYYY"));
                    } else {
                        this.setTitle("<span class='color-aquaorange-turno'>Visualizando agenda de " + this.agendaVisualizada.Recurso + "</span>" +
                            " || " + this.relacionSucursalServicioJefe.Servicio + " || " +
                            this.relacionSucursalServicioJefe.Sucursal + " || " + this.moment(this.fecha).format("dddd, D [de] MMMM [de] YYYY"));
                    }
                } else this.setTitle("SIN TURNOS EN EL DIA SELECCIONADO PARA " + this.agendaVisualizada.Recurso);
            }, (pErrorBuscar) => {
                this.$log.error('pErrorBuscar', pErrorBuscar);
            });
    }

    changeFecha() {
        if (this.agendasVisualizables && this.agendasVisualizables.length) {
            //tengo muchas agendas, busco por agendaVisualizada
            this.agendaVisualizada.Id = this.agendaVisualizada.IdRecurso;
            this.buscar(this.agendaVisualizada)
                .then((pResultBuscar) => {
                    this.$log.debug('pResultBuscar', pResultBuscar);
                    if (pResultBuscar) {
                        if (this.profesional.jefeServicio && (this.profesional.Id == this.agendaVisualizada.IdRecurso)) {
                            this.setTitle("TURNOS DE " + this.agendaVisualizada.Recurso + " || " +
                                this.relacionSucursalServicioJefe.Servicio + " - " + this.relacionSucursalServicioJefe.Sucursal + " - <b>JEFE SERVICIO</b>"
                                + " || " + this.moment(this.fecha).format("dddd, D [de] MMMM [de] YYYY"));
                        } else if (this.profesional.Id == this.agendaVisualizada.IdRecurso) {
                            this.setTitle("TURNOS DE " + this.agendaVisualizada.Recurso + " || " +
                                this.relacionSucursalServicioJefe.Servicio + " - " + this.relacionSucursalServicioJefe.Sucursal
                                + " || " + this.moment(this.fecha).format("dddd, D [de] MMMM [de] YYYY"));
                        } else {
                            this.setTitle("<span class='color-aquaorange-turno'>Visualizando agenda de " + this.agendaVisualizada.Recurso + "</span>" +
                                " || " + this.relacionSucursalServicioJefe.Servicio + " || " +
                                this.relacionSucursalServicioJefe.Sucursal + " || " + this.moment(this.fecha).format("dddd, D [de] MMMM [de] YYYY"));
                        }
                    } else this.setTitle("SIN TURNOS EN EL DIA SELECCIONADO PARA " + this.agendaVisualizada.Recurso);
                }, (pErrorBuscar) => {
                    this.$log.error('pErrorBuscar', pErrorBuscar);
                });
        } else {
            //no tengo agendas visualizables busco por profesional comun
            this.buscar(this.profesional)
                .then((pResultBuscar) => {
                    this.$log.debug('pResultBuscar', pResultBuscar);
                    if (pResultBuscar) {
                        if (this.profesional.jefeServicio) {
                            this.setTitle("TURNOS DE " + this.profesional.Apellido + ", " + this.profesional.Nombre + " || " +
                                this.relacionSucursalServicioJefe.Servicio + " - " + this.relacionSucursalServicioJefe.Sucursal + " - <b>JEFE SERVICIO</b>"
                                + " || " + this.moment(this.fecha).format("dddd, D [de] MMMM [de] YYYY"));
                        } else {
                            this.setTitle("TURNOS DE " + this.profesional.Apellido + ", " + this.profesional.Nombre + " || " +
                                this.relacionSucursalServicioJefe.Servicio + " || " +
                                this.relacionSucursalServicioJefe.Sucursal + " || " + this.moment(this.fecha).format("dddd, D [de] MMMM [de] YYYY"));
                        }
                    }
                }, (pErrorBuscar) => {
                    this.$log.error('pErrorBuscar', pErrorBuscar);
                    this.setTitle("SIN TURNOS EN EL DIA SELECCIONADO PARA " + this.profesional.Apellido + ", " + this.profesional.Nombre);
                });
        }

    }

    changeIncluirTurnosCancelados() {
        this.changeFecha();
    }

    // #endregion

    // #region /* ------------------------------------- MENU CONTEXTUAL -------------------------------------- */
    inicializarMenuOptions() {
        var vm = this;
        this.menuOptions = [{
            text: 'Editar paciente',
            displayed: function () {
                // Se puede editar si tiene un paciente asignado

                return (this.row.IdPaciente !== 0 && vm.manejoAgenda && vm.esFechaHoy());
            },
            click: ($itemScope, $event, modelValue, text, $li) => {
                this.accionTurno(3, $itemScope.row)
                // $itemScope.vm.editarPacienteDelTurno($itemScope.row);
            }
        },
        {
            text: 'Ver Auditoría',
            displayed: function () {
                var idEstado = this.row.IdEstado;
                // Se puede ver el log de auditoría salvo que el turno esté libre (8) o no este ausente (7)
                return ((idEstado !== 8 && idEstado !== 7) && (idEstado !== 6 && this.row.IdPaciente !== 0));
            },
            click: ($itemScope, $event, modelValue, text, $li) => {
                this.accionTurno(7, $itemScope.row)
            }
        }, {
            text: 'Anular',
            displayed: function () {
                var idEstado = this.row.IdEstado;
                // Se puede anular si el estado es 1 (Asignado) 
                // por el momento se deshabilita la opcion de anular para los medicos
                return false;
            },
            click: ($itemScope, $event, modelValue, text, $li) => {
                this.accionTurno(6, $itemScope.row)
                // $itemScope.vm.anularTurno($itemScope.row);
            }
        },
        {
            text: 'Asignar este turno',
            displayed: function () {
                // Se puede asignar solo si el estado es 8 (Libre)
                // por el momento se deshabilita la opcion de asignar el turno
                return false;
            },
            click: ($itemScope, $event, modelValue, text, $li) => {
                var horaTurno = $itemScope.row.Hora;
                var idItemDePlantilla = $itemScope.row.IdItemPlantilla;
                $itemScope.vm.asignarEsteTurno(horaTurno, idItemDePlantilla);
            }
        },
        {
            text: 'Llamar Paciente',
            displayed: function () {
                var idEstado = this.row.IdEstado;
                // se puede llamar si el estado del turno es:
                // Receptado (2) / Atendiendo (3) / Atendido (4)
                return (idEstado == 2 || idEstado == 3 || idEstado == 4) && this.row.PuedeLlamar && vm.esFechaHoy();
            },
            click: ($itemScope, $event, modelValue, text, $li) => {
                this.accionTurno(21, $itemScope.row)
            }
        },
        {
            text: 'Ver Motivo Cancelación Turno',
            displayed: function () {
                // Se puede ver turnos si el turno esta cancelado
                var idEstado = this.row.IdEstado;

                return (idEstado === 6 && this.row.IdPaciente !== 0);
            },
            click: ($itemScope, $event, modelValue, text, $li) => {
                this.accionTurno(14, $itemScope.row)

            }
        },
        {
            text: 'Ver Observación Turno',
            displayed: function () {
                // Se puede ver turnos si el turno esta cancelado
                var idEstado = this.row.IdEstado;

                return (idEstado !== 8 && idEstado !== 6 && this.row.IdPaciente !== 0);
            },
            click: ($itemScope, $event, modelValue, text, $li) => {
                this.accionTurno(15, $itemScope.row)

            }
        },
        {
            text: 'Iniciar Atención',
            displayed: function () {
                // Se puede ver turnos si el turno esta cancelado
                var idEstado = this.row.IdEstado;
                // voy a poder iniciar la atencion si el turno esta en receptado (2)
                return (idEstado == 2 && vm.manejoAgenda && vm.esFechaHoy());
            },
            click: ($itemScope, $event, modelValue, text, $li) => {
                this.accionTurno(16, $itemScope.row)

            }
        },
        {
            text: 'Anular Inicio Atención',
            displayed: function () {
                // Se puede ver turnos si el turno esta cancelado
                var idEstado = this.row.IdEstado;

                // voy a poder iniciar la atencion si el turno esta en atendiendo (3)
                return (idEstado == 3 && vm.manejoAgenda && vm.esFechaHoy());
            },
            click: ($itemScope, $event, modelValue, text, $li) => {
                this.accionTurno(17, $itemScope.row)

            }
        },
        {
            text: 'Finalizar Atención',
            displayed: function () {
                // Se puede ver turnos si el turno esta cancelado
                var idEstado = this.row.IdEstado;

                // voy a poder FINALIZAR la atencion si el turno esta en atendiendo (3)
                return (idEstado == 3 && vm.manejoAgenda && vm.esFechaHoy());
            },
            click: ($itemScope, $event, modelValue, text, $li) => {
                this.accionTurno(18, $itemScope.row)

            }
        },
        {
            text: 'Anular Finalizar Atención',
            displayed: function () {
                // Se puede ver turnos si el turno esta cancelado
                var idEstado = this.row.IdEstado;

                return (idEstado == 4 && vm.manejoAgenda && vm.esFechaHoy());
            },
            click: ($itemScope, $event, modelValue, text, $li) => {
                this.accionTurno(19, $itemScope.row)

            }
        },
        {
            text: 'Ver historia clinica',
            displayed: function () {

                var idEstado = this.row.IdEstado;
                // se habilita hce para todos salvo para prod
                if (vm.ENV.NAME == "production") {
                    return false;
                } else if (idEstado == 8 || idEstado == 7 || idEstado == 6 || idEstado == 5 || idEstado == 1 || !vm.esFechaHoy()) {
                    //turno en estado Libre(8) o Ausente(7) o cancelado(6) o canceladOXpaciente(5) o Asignado(1)
                    //no se muestran
                    return false;
                }
                return true;

            },
            click: ($itemScope, $event, modelValue, text, $li) => {
                this.accionTurno(20, $itemScope.row)

            }
        },

        {
            text: 'Sin acciones disponibles',
            displayed: function () {
                // Se puede ver turnos si el turno esta cancelado y no hay un paciente asignado
                var idEstado = this.row.IdEstado;

                return (idEstado == 8);
            },
            click: ($itemScope, $event, modelValue, text, $li) => {

            },
            enabled: false
        }
        ];
    }

    accionTurno(idAccion, turno) {

        switch (idAccion) {
            case 3:
                this.editarPacienteDelTurno(turno)
                break;
            case 6:
                this.anularTurno(turno)
                break;
            case 7:
                this.verAuditoriaDelTurno(turno);
                break;
            case 13:
                this.verTurnosPaciente(turno);
                break;
            case 14:
                this.verMotivoCancelacion(turno);
                break;
            case 15:
                this.verObservacionTurno(turno);
                break;
            case 16:
                this.iniciarAtencion(turno);
                break;
            case 17:
                this.anularIniciarAtencion(turno);
                break;
            case 18:
                this.finalizarAtencion(turno);
                break;
            case 19:
                this.anularFinalizarAtencion(turno);
                break;
            case 20:
                this.verHistoriaClinica(turno);
                break;
            case 21:
                this.llamarAlPaciente(turno);
                break;
        }
    }

    editarPacienteDelTurno(pRowTurno) {
        this.$log.debug('Editar paciente del turno: ', pRowTurno);
        //this.setStoredData();
        // this.$state.go('paciente.edit', { //MODULO DESACTIVADO
        //     idPaciente: pRowTurno.IdPaciente
        // });
    }


    verAuditoriaDelTurno(pRowTurno) {
        this.$log.debug('Ver auditoría del turno ', pRowTurno);
        this.TurnosLogicService.verLogDeAuditoria(pRowTurno.Id);
    }

    verTurnosPaciente(turno) {

        this.$log.debug('verTurnosPaciente', turno);
        var _pac = {
            Nombre: turno.Paciente,
            NumeroDocumento: turno.NumeroDocumento,
            TipoDocumento: 'DNI',
            Id: turno.IdPaciente
        }
        this.TurnosCommonLogicService.openTurnosPaciente(_pac, true, false, false)
            .then((pResult) => {
                this.$log.debug('result component turnos paciente', pResult);
            }, (pError) => {
                this.$log.error('result component turnos paciente', pError);
            });
    }

    verMotivoCancelacion(turno) {
        this.TurnosCommonLogicService.openMotivosCancelacionDeUnTurno(turno.Id);
    }

    verObservacionTurno(turno) {
        this.loading = true;
        this.TurnoDataService.obtenerObservacionesPorTurno(turno.Id)
            .then((pObservacionOk) => {
                this.loading = false;
                if (pObservacionOk.length >= 1) {

                    this.TurnosCommonLogicService.openObservacionTurno(this.RecepcionTurnosLogicService.parsearObservaciones(pObservacionOk));
                } else {
                    this.AlertaService.NewWarning("No existe ninguna observación");
                }
            }, (pObservacionError) => {
                this.loading = false;

                this.$log.error('Obtener ObservacionError', pObservacionError);
            })
    }

    anularTurno(pRowTurno) {
        this.$log.debug('Anular turno ', pRowTurno);
        this.ModalService.confirm('¿Está seguro que desea anular el turno de las ' + pRowTurno.Hora + '?',
            (_pOk) => {
                if (_pOk) {
                    //ANULAR O CANCELAR TURNO
                    this.TurnosCommonLogicService.openCancelacionDeTurnosModal(pRowTurno)
                        .then((anularTurnoOk) => {
                            if (anularTurnoOk) {
                                this.buscar(this.profesional);
                            }
                        }, (anularTurnoError) => {
                            this.$log.error('error anulrTurno', anularTurnoError);
                        })
                }
            }, "", this.optionsObj);
    }

    iniciarAtencion(pRowTurno) {
        this.$log.debug('iniciarAtencion ', pRowTurno);
        this.TurnoDataService.iniciarAtencion(pRowTurno.Id)
            .then((pResult) => {
                this.$log.debug('pResult', pResult);
                if (pResult.IsOk) {
                    this.AlertaService.NewSuccess("Atención Iniciada");
                    this.buscar(this.profesional);
                } else {
                    this.AlertaService.NewWarning(pResult.Message);
                }
            }, (pError) => {
                this.$log.error('pError', pError);
            });

    }
    anularIniciarAtencion(pRowTurno) {
        this.$log.debug('anularIniciarAtencion ', pRowTurno);
        this.TurnoDataService.anularIniciarAtencion(pRowTurno.Id)
            .then((pResult) => {
                this.$log.debug('pResult', pResult);
                if (pResult.IsOk) {
                    this.AlertaService.NewSuccess("Inicio Atención Anulada");
                    this.buscar(this.profesional);
                } else {
                    this.AlertaService.NewWarning(pResult.Message);
                }
            }, (pError) => {
                this.$log.error('pError', pError);
            });

    }
    finalizarAtencion(pRowTurno) {
        this.$log.debug('finalizarAtencion ', pRowTurno);
        this.TurnoDataService.finalizarAtencion(pRowTurno.Id)
            .then((pResult) => {
                this.$log.debug('pResult', pResult);
                if (pResult.IsOk) {
                    this.AlertaService.NewSuccess("Atención Finalizada");
                    this.buscar(this.profesional);
                } else {
                    this.AlertaService.NewWarning(pResult.Message);
                }
            }, (pError) => {
                this.$log.error('pError', pError);
            });

    }
    anularFinalizarAtencion(pRowTurno) {
        this.$log.debug('anularFinalizarAtencion ', pRowTurno);
        this.TurnoDataService.anularFinalizarAtencion(pRowTurno.Id)
            .then((pResult) => {
                this.$log.debug('pResult', pResult);
                if (pResult.IsOk) {
                    this.AlertaService.NewSuccess("Finalizar Atención Anulada");
                    this.buscar(this.profesional);
                } else {
                    this.AlertaService.NewWarning(pResult.Message);
                }
            }, (pError) => {
                this.$log.error('pError', pError);
            });

    }

    verHistoriaClinica(turno) {

        // voy a ver la historia clinica por turno. Tengo que obtener con el enpoint de ingreso
        this.loading = true;
        this.ingresoHCEDataService.ingresarHCEAmbulatoriaPorTurno(turno.Id)
            .then((ingresoHceOk: IIngresoHCEDto) => {
                this.$log.debug('ingresoHceOk', ingresoHceOk);
                this.loading = false;
                //tengo que consultar si puedo ingresar
                if (ingresoHceOk && ingresoHceOk.PuedeIngresar) {
                    //guardo storage que me traje desde backend => IIngresoHcedto
                    this._storage.set(this.storageKeys.keyHistoriaClinica, ingresoHceOk);
                    //una vez que guarde vamos a la url de hce de app2
                    window.location.href = `${this.ENV.APP2}/hclinica/hce`;
                } else {
                    if (!ingresoHceOk.PuedeIngresar && ingresoHceOk.MotivoIngresoNoValido) {
                        //tengo un motivo para no ingresar => lo tengo que mostrar
                    } else {
                        //no puedo ingresar pero no tengo motivo muestro warning
                        this.AlertaService.NewWarning("Atención, hubo un error", "Usted no puede ingresar a la historia clinica. Comunicarse con sistemas");
                    }
                }

            }, (pErrorIngreso) => {
                this.loading = false;
                this.$log.error('pErrorIngreso', pErrorIngreso);
            });

    }

    llamarAlPaciente(turno) {
        this.$log.debug('llamarAlPaciente ', turno);
        if (this.consultorio && this.consultorio.Id) {
            this.TurnoDataService.llamar(turno.Id, this.consultorio.Id)
                .then((pResult) => {
                    this.$log.debug('pResult', pResult);
                    if (pResult.IsOk) {
                        this.AlertaService.NewSuccess("El paciente ha sido llamado");
                        //this.buscar(this.profesional);
                    } else {
                        this.AlertaService.NewWarning(pResult.Message);
                    }
                }, (pError) => {
                    this.$log.error('pError', pError);
                });
        } else { 
            this.AlertaService.NewWarning("Atencion, debe seleccionar un consultorio para poder llamar a un paciente");
        }
        
    }


    asignarEsteTurno(pHoraTurno, pIdItemDePlantilla) {

        this.$log.debug('Asignar este turno - inicio. Hora/Item', pHoraTurno, pIdItemDePlantilla);
        var vm = this;
        // Valido que no se puedan dar turno en fechas anteriores a la actual
        // Si la fecha seleccionada es despues de la fecha actual -> recepto
        if (this.moment(this.fecha).isAfter(this.moment())) {

            this.irAAsignar(pHoraTurno, pIdItemDePlantilla);

        } else if (this.moment(this.fecha).isSame(this.moment(), 'day')) {


            var fechaActualSinHora = this.obtenerFechaActualSinHora();
            // valido que la fecha-hora del turno no sea anterior a la fecha/hora actual
            var horas = parseInt(pHoraTurno.substring(0, 2));
            var minutos = parseInt(pHoraTurno.substring(3, 5));

            var fechaActualConHoras = fechaActualSinHora;
            fechaActualConHoras.setHours(horas);
            fechaActualConHoras.setMinutes(minutos);
            var fechaHoraActual = new Date();

            if (fechaActualConHoras < fechaHoraActual) {

                this.$log.debug("Fecha/Hora del turno ya superada!");
                this.AlertaService.NewWarning("Atención", "No se puede asignar un turno libre si el horario de atención ya fue superado");
                return;

            } else {
                this.irAAsignar(pHoraTurno, pIdItemDePlantilla);
            }
        } else {
            this.$log.debug("Fecha anterior!");
            this.AlertaService.NewWarning("Atención", "No se puede asignar un turno libre con una fecha anterior a la actual");
            return;
        }

    }

    irAAsignar(pHoraTurno, pIdItemDePlantilla) {

        var fecha = this.moment(this.fecha);

        this.$log.debug("Antes de $state.go a asignar turno desde Recepcion: fecha - hora - item - recurso - servicio - sucursal",
            this.fecha, pHoraTurno, pIdItemDePlantilla, this.recurso, this.servicio, this.sucursal);

        this.setStoredData();

        var _recurso;
        var _servicio;
        var _sucursal;

        if (this.agendasVisualizables && this.agendasVisualizables.length == 0) {

            _servicio = {
                Id: this.relacionSucursalServicioJefe.IdServicio,
                Nombre: this.relacionSucursalServicioJefe.Servicio
            }

            _recurso = {
                Id: this.profesional.Id,
                IdTipoRecurso: this.profesional.IdTipoRecurso,
                Nombre: this.profesional.Nombre + " " + this.profesional.Apellido
            }

            _sucursal = {
                Id: this.relacionSucursalServicioJefe.IdSucursal,
                Nombre: this.relacionSucursalServicioJefe.Sucursal
            }

        } else if (this.agendasVisualizables && this.agendasVisualizables.length) {

            _servicio = {
                Id: this.relacionSucursalServicioJefe.IdServicio,
                Nombre: this.relacionSucursalServicioJefe.Servicio
            }

            _recurso = {
                Id: this.agendaVisualizada.IdRecurso,
                IdTipoRecurso: this.agendaVisualizada.IdTipoRecurso,
                Nombre: this.agendaVisualizada.Recurso
            }

            _sucursal = {
                Id: this.relacionSucursalServicioJefe.IdSucursal,
                Nombre: this.relacionSucursalServicioJefe.Sucursal
            }
        }

        this.$state.go('consultorioMedico.asignar', {
            fecha: fecha,
            hora: pHoraTurno,
            idItemDePlantilla: pIdItemDePlantilla,
            servicio: _servicio,
            recurso: _recurso,
            sucursal: _sucursal
        });
    }


    obtenerFechaActualSinHora() {
        var fechaActual = new Date();
        fechaActual.setHours(0);
        fechaActual.setMinutes(0);
        fechaActual.setSeconds(0);
        return fechaActual;
    }


    esFechaFeriado() {

        let _fecha = this.moment(this.fecha).format("MM-DD-YYYY");
        // obtengo feriados por rango con ultimo parametro == 2 (aplicado);
        this.MantenimientoAgendaDataService.obtenerFeriadosPorFiltro(_fecha, _fecha, 2)
            .then((pResult) => {
                this.$log.debug('pResultConsultaFeriado', pResult);
                //aplicao if es feriado;
                if (pResult && pResult.length) {
                    // tengo feriado este dia
                    this.esDiaFeriado = pResult[0];
                } else {
                    // no tengo feriado
                    this.esDiaFeriado = false;
                }
            }, (pError) => {
                this.$log.error('pErrorConsultaFeriado', pError);
            });
    }


    buscarHistoriaClinica() {
        console.log("abriendo modal de hce");
        this.SupportLogicService.openBuscadorPaciente(null, true, null, true)
            .then((resultPaciente) => {

                console.log(resultPaciente);
                if (resultPaciente && resultPaciente.Id) {


                    //voy a ver la historia clinica por paciente. Tengo que obtener con el enpoint de ingreso
                    this.loading = true;
                    this.ingresoHCEDataService.ingresarHCEAmbulatoriaPorPaciente(resultPaciente.Id)
                        .then((ingresoHceOk: IIngresoHCEDto) => {
                            this.$log.debug('ingresoHceOk', ingresoHceOk);
                            this.loading = false;
                            //tengo que consultar si puedo ingresar
                            if (ingresoHceOk && ingresoHceOk.PuedeIngresar) {
                                //guardo storage que me traje desde backend => IIngresoHcedto
                                this._storage.set(this.storageKeys.keyHistoriaClinica, ingresoHceOk);
                                //una vez que guarde vamos a la url de hce de app2
                                window.location.href = `${this.ENV.APP2}/hclinica/hce`;
                            } else {
                                if (!ingresoHceOk.PuedeIngresar && ingresoHceOk.MotivoIngresoNoValido) {
                                    //tengo un motivo para no ingresar => lo tengo que mostrar
                                } else {
                                    //no puedo ingresar pero no tengo motivo muestro warning
                                    this.AlertaService.NewWarning("Atención, hubo un error", "Usted no puede ingresar a la historia clinica. Comunicarse con sistemas");
                                }
                            }

                        }, (pErrorIngreso) => {
                            this.loading = false;
                            this.$log.error('pErrorIngreso', pErrorIngreso);
                        });
                }

            }, (pError) => {
                this.AlertaService.NewWarning("Atención, hubo un error", "Usted no puede ingresar a la historia clinica. Comunicarse con sistemas");
            });

    }
    // #endregion

    // #region /* -------------------------------------- BUSCADOR PACIENTE ----------------------------------- */

    changeFilterPaciente() {
        this.$log.debug('changeFilterPaciente ', this.filterBuscarPaciente);
        if (this.filterBuscarPaciente) {
            var _pacientesTurnos = this.turnosPorRecurso.filter(x =>
                x.Paciente.includes(this.filterBuscarPaciente.toUpperCase()) ||
                x.NumeroDocumento.includes(this.filterBuscarPaciente));

            this.$log.debug('_pacientesTurnos ', _pacientesTurnos);
            //tengo los turnos de los paciente con el nombre parecido
            // puedo tener 1: caso ideal voy y busco

            if (_pacientesTurnos.length === 1) {
                angular.forEach(this.turnosPorRecurso, (_turno) => {
                    angular.forEach(_pacientesTurnos, (turnoPaciente) => {
                        if (turnoPaciente.Id === _turno.Id) {
                            this.turnosPorRecurso.find(x => x.Id == turnoPaciente.Id).selected = true;
                            this.scrollTableTurnos(this.turnosPorRecurso.find(x => x.Id == turnoPaciente.Id).IdRow);
                        }
                    })

                });
            } else if (_pacientesTurnos.length > 1) {
                // tengo mas de uno: entonces tengo que scrollear hasta el primero
                angular.forEach(this.turnosPorRecurso, (_turno) => {
                    angular.forEach(_pacientesTurnos, (turnoPaciente) => {
                        if (turnoPaciente.Id === _turno.Id) {
                            this.turnosPorRecurso.find(x => x.Id == turnoPaciente.Id).selected = true;
                        }
                    })
                });
                this.scrollTableTurnos(this.turnosPorRecurso.find(x => x.Id == _pacientesTurnos[0].Id).IdRow);

            } else this.limpiarTurnosSelected();
        } else this.limpiarTurnosSelected();
    }

    limpiarTurnosSelected() {
        angular.forEach(this.turnosPorRecurso, (_turno) => {
            this.turnosPorRecurso.find(x => x.Id == _turno.Id).selected = false;
        })
    }

    scrollTableTurnos(IdRow) {
        var elm: any = $(".bodyturnos");
        var elmRow: any = $(".rowturnos");

        var vm = this;

        function anim() {

            var scrollTo = IdRow * elmRow.innerHeight();

            elm.animate({
                scrollTop: scrollTo
            }, 650);
        }

        anim();
    }

    //#endregion

    // #region /* -------------------------------------- AUTOREFRESH ----------------------------------------- */
    setElementWrapper() {
        var timeout;
        $("#wrapper").on('mousemove', function (event) {
            if (timeout !== undefined) {
                window.clearTimeout(timeout);
            }
            timeout = window.setTimeout(function () {
                // trigger the new event on event.target, so that it can bubble appropriately
                $(event.target).trigger('mousemoveend');
            }, 100);
        });


        $('#wrapper').on('mousemoveend', () => {

            if (this.timeoutId) clearInterval(this.timeoutId);

            this.timeoutId = setInterval(() => {
                // voy a mostrar log para actualizar
                this.$log.debug('Inactividad por 60000 millisegundos, ACTUALIZO LISTA/AGENDA DE RECURSOS!');
                // actualizo recepcion, pero que sucede si actualizo y todavia no hay 
                // refresco datos => busco profesional de nuevo
                this.recargar();
            }, 60000);
        });
    }

    // #endregion


    /* ------------------------------------------------- STORAGE -------------------------------------------------- */
    // #region STORAGE
    getStoredData() {
        var vm = this;

        if (this.StorageService.existStoredObjects(this.storageKeys.keyConsultorioMedico)) {
            getData(this.StorageService.getStorageObj(this.storageKeys.keyConsultorioMedico));
            this.cleanStorage();
        }

        function getData(stored) {
            vm.fecha = stored.fechaSeleccionada ? vm.moment(stored.fechaSeleccionada, 'DD-MM-YYYY').toDate() : new Date();
            vm.esFechaFeriado();
        }
    }

    existStorage() {
        let ret = false;
        if (this.StorageService.existStoredObjects(this.storageKeys.keyConsultorioMedico)) {
            ret = true;
        }
        return ret;
    }

    cleanStorage() {
        this.StorageService.cleanStorage(this.storageKeys.keyConsultorioMedico);
    }

    setStoredData() {
        var recepcionStorageData = {
            fechaSeleccionada: angular.copy(this.moment(this.fecha).format("DD-MM-YYYY")) || null, // ✔
        }
        this.StorageService.setStorageObj(this.storageKeys.keyConsultorioMedico, recepcionStorageData);
    }
    //endregion
}