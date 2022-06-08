/**
* @author:         Pablo Pautasso   
* @description:    Controller para recepcion de turnos
* @type:           Controller
**/
import * as angular from 'angular';
import { IRecepcionTurnosDataService } from '../../../recepcionTurnos/services/RecepcionTurnosDataService';
import { IServiciosGestionDataService } from '../../../basicos/servicios/gestion/services/ServiciosGestionDataService';
import { IRecursosDataService } from '../../../basicos/recursos/gestion/services/RecursosDataService';
import { IRecepcionTurnosLogicService } from '../../../recepcionTurnos/services/RecepcionTurnosLogicService';
import { IRecepcionTurnosStorageHelperService } from 'src/app/allendeModules/recepcionTurnos/services/RecepcionTurnosStorageHelperService';


import { ISucursalDataService, ISupportDataService } from '../../../support/basic/services';
import { ICredentialsDataService } from 'core/security';


export class RecepcionTurnosController implements angular.IController {
    // ID
    static $inject = ['Logger', '$state', '$stateParams', '$q', '$timeout', "uiCalendarConfig", 'moment',
        'CredentialsDataService', 'RecepcionTurnosDataService', 'SucursalDataService',
        'ServiciosGestionDataService', 'RecursosDataService', 'AsignacionTurnoDataService', 'TurnoDataService', 'AutorizadorDataService',
        'AutorizadorLogicService', 'PlantillaDataService', 'SupportDataService', 'ModalService', 'PlantillaLogicService',
        'RecepcionTurnosLogicService', 'AlertaService', 'RecepcionTurnosStorageHelperService', 'TurnosLogicService', 'ORIGEN_PREFACTURA', 'TurnosCommonLogicService',
        'MantenimientoAgendaDataService', 'MantenimientoAgendaAuthService', 'ENV'];


    /* ------------------------------------------------  VARIABLES ------------------------------------------------ */
    // #region VARIABLES

    buscadorPaciente: boolean = false;
    idTurnoEnviarAEfector: number = 0;
    filterBuscarPaciente: string = "";

    loading: boolean = false;
    obtenerCancelados: boolean = false;
    user: any;
    recepcionesDeUsuario: any;
    estadosDeTurnos: any;
    tiposDeTurnos: any;
    serviciosXRecepcion: any;
    servicios: any;
    sucursales: any;
    soloRecursosConTurnosEnLaFecha: boolean = false;
    motivoAnulacion: any;
    //modelos de datos de turnos recibidos
    recursosXRecepcion: any;
    recursosSeleccionados: any;

    //
    servicioRecepcionModel: any;
    recepcionModel: any;
    uiConfig: any;
    timePrevScheduler: any = 20;
    //variable para mostrar scheduler o no
    schedulerOn: boolean = false;

    //fecha precargada
    fechaSeleccionada = new Date();
    //boolean es dia feriado
    esDiaFeriado: any;    
	permisoVerMotivoDeReceso: boolean = false;

    //Storage variables
    storageKeys = {
        keyRecepcion: "recepcion-data"
    }
    //
    menuOptions: any;
    menuOptionsProfesional: any;

    title = {
        name: 'Recepcion De Turnos',
        icon: 'LIST'
    };

    optionsObj = {
        ok: 'Si',
        cancel: 'No'
    };

    timeoutId: any;
    // Constructor
    constructor(

        private $log: ILogger,
        private $state,
        private $stateParams,
        private $q,
        private $timeout,
        private uiCalendarConfig,
        private moment,
        private CredentialsDataService: ICredentialsDataService,
        private RecepcionTurnosDataService: IRecepcionTurnosDataService,
        private SucursalDataService: ISucursalDataService,
        private ServiciosGestionDataService: IServiciosGestionDataService,
        private RecursosDataService: IRecursosDataService,
        private AsignacionTurnoDataService,
        private TurnoDataService,
        private AutorizadorDataService,
        private AutorizadorLogicService,
        private PlantillaDataService,
        private SupportDataService: ISupportDataService,
        private ModalService,
        private PlantillaLogicService,
        private RecepcionTurnosLogicService: IRecepcionTurnosLogicService,
        private AlertaService: IAlertaService,
        private StorageService: IRecepcionTurnosStorageHelperService,
        private TurnosLogicService,
        private ORIGEN_PREFACTURA,
        private TurnosCommonLogicService,
        private MantenimientoAgendaDataService,
        private MantenimientoAgendaAuthService,
        private ENV

    ) { }

    //endregion

    /* ------------------------------------------------- ACTIVATE ------------------------------------------------- */
    // #region ACTIVATE
    $onInit() {
        this.$log = this.$log.getInstance('RecepcionTurnosController');
        this.$log.debug("INIT");

        var vm = this;
        if (this.schedulerOn)
            this.inicializarScheduler();
        
        this.user = this.CredentialsDataService.GetForce();
        this.permisoVerMotivoDeReceso = this.MantenimientoAgendaAuthService.puedeVerMotivoDeReceso(this.user);

        this.inicializarMenuOptions();
        this.inicializarMenuOptionsProfesional();

        //se comenta autorefresh para ver rendimiento
        //this.setElementWrapper();

        this.inicializarDatos()
            .then((pOk) => {
                //llamo a getstoreddata
                this.getStoredData();
                if (this.$stateParams.enviarEfector) { 
                    //tengo enviar efector
                    console.log(this.$stateParams.enviarAEfector);
                    var idTurno = this.idTurnoEnviarAEfector;
                    if(idTurno > 0) {
                        this.$log.debug('pResponse NOT OK');
                        this.ModalService.confirm('¿Quiere enviar el turno al efector?',
                        (_pOk) => {
                            if (_pOk) {
                                this.TurnoDataService.enviarAEfector(idTurno)
                                    .then((pResponseEnviar) => {
                                        if (!pResponseEnviar.IsOk) {                                                            
                                            this.loading = false;
                                            if (pResponseEnviar.Message !== null)
                                                this.AlertaService.NewError(pResponseEnviar.Message);
                                            else
                                                this.AlertaService.NewError("Error De Servidor");
                                        }
                                    }, (pErrorReceptar) => {
                                        this.loading = false;
                                    });
                            }
                        }, "", vm.optionsObj);    
                      
        
                        vm.idTurnoEnviarAEfector = 0;
                    }
                }
            }, (pError) => {
                this.$log.error("pError InicializarDatos", pError)
            });
    }

    inicializarDatos() {
        //creo la promesa
        var def = this.$q.defer();

        this.loading = true;
        // obtengo el usuario logueado
        // this.user = this.CredentialsDataService.GetForce();
        // this.$log.debug("user obtenido", this.user);
        // obtengo las recepciones para mostrar que tienen el usuario logueado
        // var _recepcionPorUsuario = this.RecepcionTurnosDataService.obtenerRecepcionPorUsuario(this.user.id);
        var _estadosDeTurnos = this.TurnoDataService.obtenerTiposEstadoTurnos();
        var _tiposDeTurnos = this.PlantillaDataService.obtenerTiposDeTurnos();
        var _servicios = this.ServiciosGestionDataService.getAll();
        var _sucursales = this.SucursalDataService.getAllSucursalesConFiltro();

        this.recepcionesDeUsuario = this.user.recepciones;
        this.$q.all([
            //_recepcionPorUsuario,
            _estadosDeTurnos,
            _tiposDeTurnos,
            _servicios,
            _sucursales
        ]).then((pResults) => {

            this.$log.debug('obteniendo resultados onInit', pResults);
            
            this.estadosDeTurnos = pResults[0];
            this.tiposDeTurnos = pResults[1];
            this.servicios = pResults[2];
            this.sucursales = pResults[3];
            this.loading = false;
            def.resolve("Ok");

        }, (pError) => {
            this.$log.error('Error onInit', pError);
            this.loading = false;
            def.reject(pError);
        });

        return def.promise;
    }

    //endregion

    /* ------------------------------------------------- GET DATOS ------------------------------------------------ */
    // #region GET DATOS
    getServiciosPorRecepcion() {

        var def = this.$q.defer();
        this.$log.debug("getServiciosPorRecepcion", this.recepcionModel);

        if (this.recepcionModel) {
            this.loading = true;
            this.ServiciosGestionDataService.obtenerPorRecepcionPorUsuario(this.recepcionModel.Id)
                .then((pResults) => {
                    this.$log.debug('obtenerServiciosPorRecepcionOk', pResults);
                    this.serviciosXRecepcion = angular.copy(pResults);
                    this.loading = false;
                    def.resolve("Ok");
                }, (pError) => {
                    this.$log.error('obtenerServiciosPorRecepcionError ', pError);
                    this.loading = false;
                    def.reject(pError);
                });
        } else this.limpiar();

        return def.promise;
    }

    getRecursosPorRecepcion() {

        var def = this.$q.defer();
        if (this.recepcionModel) {
            if (this.soloRecursosConTurnosEnLaFecha) {
                this.getRecursosPorRecepcionConTurnosEnLaFecha()
                    .then(getRecursosOk, getRecursosError);
            } else {
                this.getRecursosPorRecepcionTodos()
                    .then(getRecursosOk, getRecursosError);
            }
        }
        function getRecursosOk(_recursos) {
            def.resolve("Ok");
        }
        function getRecursosError(_error) {
            def.reject(_error);
        }
        // Esto se ejecuta en forma sincrina
        this.limpiarDatosTurnos();
        return def.promise;
    }

    getRecursosPorRecepcionYServicio() {

        var def = this.$q.defer();
        if (this.servicioRecepcionModel) {
            if (this.soloRecursosConTurnosEnLaFecha) {
                this.getRecursosPorRecepcionYServicioTodosConTurnos()
                    .then(getRecursosOk, getRecursosError);
            } else {
                this.getRecursosPorRecepcionYServicioTodos()
                    .then(getRecursosOk, getRecursosError);
            }
        } else {
            this.getRecursosPorRecepcion()
                .then(getRecursosOk, getRecursosError);
        }
        function getRecursosOk(_recursos) {
            def.resolve("Ok");
        }
        function getRecursosError(_error) {
            def.reject(_error);
        }
        return def.promise;
    }

    getRecursosPorRecepcionConTurnosEnLaFecha() {

        var def = this.$q.defer();

        this.$log.debug("getRecursosPorRecepcionConTurnosEnLaFecha", this.recepcionModel);
        this.loading = true;
        var fecha = this.moment(this.fechaSeleccionada).format("MM-DD-YYYY");
        var pSoloActivos = true;
        this.RecursosDataService.obtenerPorRecepcionConTurnosPorUsuario(this.recepcionModel.Id, this.recepcionModel.IdSucursal, fecha, pSoloActivos)
            .then((pResults) => {
                this.$log.debug('getRecursosPorRecepcionConTurnosEnLaFecha ok', pResults);
                this.recursosXRecepcion = angular.copy(pResults);
                angular.forEach(this.recursosXRecepcion, function (recurso) {
                    recurso.selected = false;
                });
                def.resolve("Ok");
                this.loading = false;
            }, (pError) => {
                this.$log.error('getRecursosPorRecepcionConTurnosEnLaFecha error ', pError);
                this.loading = false;
                def.reject(pError);
            });

        return def.promise;
    }

    getRecursosPorRecepcionTodos() {

        var def = this.$q.defer();

        this.$log.debug("getRecursosPorRecepcion", this.recepcionModel);
        this.loading = true;
        var pSoloActivos = true;
        this.RecursosDataService.obtenerPorRecepcionPorUsuario(this.recepcionModel.Id, this.recepcionModel.IdSucursal, pSoloActivos)
            .then((pResults) => {
                this.$log.debug('obtenerRecursosPorRecepcionOk', pResults);
                this.recursosXRecepcion = angular.copy(pResults);
                angular.forEach(this.recursosXRecepcion, function (recurso) {
                    recurso.selected = false;
                })
                this.loading = false;
                def.resolve("Ok");
            }, (pError) => {
                this.$log.error('obtenerRecursosPorRecepcionError ', pError);
                this.loading = false;
                def.reject(pError);
            });
        return def.promise;
    }

    getRecursosPorRecepcionYServicioTodos() {
        var def = this.$q.defer();
        this.$log.debug("getRecursosPorRecepcionYServicioTodos", this.servicioRecepcionModel);
        this.loading = true;
        var pSoloActivos = true;
        this.RecursosDataService.obtenerTodosDeUnServicioEnRecepcion(this.servicioRecepcionModel.Id, this.recepcionModel.Id)
            .then((pResults) => {
                this.$log.debug('getRecursosPorRecepcionYServicioTodos OK', pResults);
                this.recursosXRecepcion = angular.copy(pResults);
                angular.forEach(this.recursosXRecepcion, (recurso) => {
                    recurso.selected = false;
                    recurso.IdServicio = this.servicioRecepcionModel.Id;
                })
                def.resolve("Ok");
                this.loading = false;
            }, (pError) => {
                this.$log.error('getRecursosPorRecepcionYServicioTodos Error ', pError);
                this.loading = false;
                def.reject(pError);
            });
        return def.promise;
    }

    getRecursosPorRecepcionYServicioTodosConTurnos() {

        var def = this.$q.defer();
        this.$log.debug("getRecursosPorRecepcionYServicioTodosConTurnos. this.servicioRecepcionModel:  ", this.servicioRecepcionModel);
        this.loading = true;

        var pIdServicio = this.servicioRecepcionModel.Id;
        var pIdRecepcion = this.recepcionModel.Id;
        var pFecha = this.moment(this.fechaSeleccionada).format("YYYY-MM-DD");
        var pSoloActivos = true;

        this.RecursosDataService.obtenerTodosDeUnServicioEnRecepcionConTurnos(pIdServicio, pIdRecepcion, pFecha, pSoloActivos)
            .then((pResults) => {
                this.$log.debug('getRecursosPorRecepcionYServicioTodosConTurnos OK', pResults);
                this.recursosXRecepcion = angular.copy(pResults);
                angular.forEach(this.recursosXRecepcion, (recurso) => {
                    recurso.selected = false;
                    recurso.IdServicio = angular.copy(this.servicioRecepcionModel.Id);
                })
                def.resolve("Ok");
                this.loading = false;
            }, (pError) => {
                this.$log.error('getRecursosPorRecepcionYServicioTodosConTurnos Error ', pError);
                this.loading = false;
                def.reject(pError);
            });
        return def.promise;
    }
    //endregion

    /* --------------------------------------------- CHANGE FORMULARIO -------------------------------------------- */
    // #region CHANGE FORMULARIO
    changeFechaSeleccionada() {

        this.$log.debug("changeFechaSeleccionada", this.fechaSeleccionada);
        if (this.soloRecursosConTurnosEnLaFecha && this.getCantidadProfesionalesSelected() == 0) {
            //busco RECURSOS solo para la fecha puesta
            this.soloConAgendaHoyChange();
        } else if (this.getCantidadProfesionalesSelected() != 0) {
            //voy a buscar nuevos turnos para el RECURSO seleccionado o los RECURSOS seleccionados
            //busco profesional primero o profesionales seleccionados
            var _recurso = this.recursosXRecepcion.find(x => x.selected === true)
            if (_recurso)
                this.toggleProfesional(_recurso);
        }

        //cambie de fecha => voy a consultar si es feriado
        this.esFechaFeriado();
    }

    esFechaFeriado() {

        let _fecha = this.moment(this.fechaSeleccionada).format("MM-DD-YYYY");
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

    soloConAgendaHoyChange() {

        this.$log.debug("soloConAgendaHoyChange", this.soloRecursosConTurnosEnLaFecha);

        if (!this.servicioRecepcionModel)
            this.getRecursosPorRecepcion();
        else this.getRecursosPorRecepcionYServicio();
        this.limpiarDatosTurnos();

    }


    toggleProfesional(recurso) {

        this.$log.debug("toggleProfesional", recurso);
        if (recurso.selected) {
            //consulto turnos para profesional
            this.loading = true;
            this.AsignacionTurnoDataService.obtenerTurnosPorRecursoParaRecepcion(recurso.Id, recurso.IdTipoRecurso, recurso.IdServicio || this.servicioRecepcionModel.Id,
                this.recepcionModel.IdSucursal, this.moment(this.fechaSeleccionada).format("MM-DD-YYYY"), this.obtenerCancelados)
                .then((pResults) => {

                    this.$log.debug('result ', pResults);
                    var _turnos = this.setearDatosTurnos(pResults);
                    this.recursosXRecepcion.find(x => x.Id === recurso.Id).Turnos = angular.copy(_turnos);

                    if (!this.schedulerOn) {
                        this.limpiarRecursosSeleccionados(recurso);
                    }
                    else this.setearEventos(recurso);

                    var _selected: any = [];
                    _selected.push(this.recursosXRecepcion.find(x => x.selected == true));
                    this.recursosSeleccionados = angular.copy(_selected);

                    this.loading = false;

                }, (pError) => {
                    this.$log.error('error', pError);
                    this.loading = false;
                });
        } else {

            if (this.schedulerOn) {
                this.uiConfig.scheduler.resources = $.grep(this.uiConfig.scheduler.resources, function (e: any) {
                    return e.id != recurso.Id;
                });
                this.calendarRender();
            } else {
                this.recursosSeleccionados = [];
            }
        }
    }

    refrescar() {
        this.$log.debug('refrescar...');
        if (this.recursosXRecepcion) {
            var _recurso = this.recursosXRecepcion.find(x => x.selected === true)
            if (_recurso) {
                this.toggleProfesional(_recurso);
            }
        }
    }
    //endregion

    /* ------------------------------------------------- OBTENER -------------------------------------------------- */
    // #region OBTENER
    obtenerTurnosPorRecurso(recurso) {
        //consulto turnos para profesional
        var _ret = 0;
        if (recurso.selected) {
            this.loading = true;
            this.AsignacionTurnoDataService.obtenerTurnosPorRecursoParaRecepcion(recurso.Id, recurso.IdTipoRecurso, recurso.IdServicio || this.servicioRecepcionModel.Id,
                this.recepcionModel.IdSucursal, this.moment(this.fechaSeleccionada).format("MM-DD-YYYY"), this.obtenerCancelados)
                .then((pResults) => {
                    this.$log.debug('result ', pResults);
                    _ret = angular.copy(pResults);
                    this.loading = false;
                }, (pError) => {
                    this.$log.error('error', pError);
                    this.loading = false;
                })
        }
        return _ret;
    }

    obtenerServicioPorId(pId) {
        var servicioEncontrado: any;
        angular.forEach(this.servicios, function (servicio) {
            if (servicio.Id === pId) {
                servicioEncontrado = servicio;
            }
        });
        return servicioEncontrado;
    }

    obtenerSucursalPorId(pId) {
        var sucursalEncontrada: any;
        angular.forEach(this.sucursales, function (sucursal) {
            if (sucursal.Id === pId) {
                sucursalEncontrada = sucursal;
            }
        });
        return sucursalEncontrada;
    }

    obtenerFechaActualSinHora() {
        var fechaActual = new Date();
        fechaActual.setHours(0);
        fechaActual.setMinutes(0);
        fechaActual.setSeconds(0);
        return fechaActual;
    }
    //endregion

    /* ------------------------------------------------- ASIGNAR -------------------------------------------------- */
    // #region ASIGNAR

    asignarSobretrunoDNP() {

        if (this.getCantidadProfesionalesSelected() > 0) {

            if (this.recursosSeleccionados[0].Turnos.find(x => x.IdEstado === 8)) {
                this.ModalService.confirm("Atención, existen turnos libres para asignar, desea continuar a DNP de todas maneras?",
                    (pResponse) => {

                        if (pResponse) {
                            var servicio = this.obtenerServicioPorId(this.recursosSeleccionados[0].IdServicio);
                            var recurso = {
                                Id: angular.copy(this.recursosSeleccionados[0].Id),
                                IdTipoRecurso: angular.copy(this.recursosSeleccionados[0].IdTipoRecurso),
                                Nombre: angular.copy(this.recursosSeleccionados[0].Nombre)
                            };
                            var sucursal = this.obtenerSucursalPorId(this.recepcionModel.IdSucursal);
                            this.$log.debug("Antes de $state.go a DNP: fecha - servicio - recurso - sucursal", this.fechaSeleccionada, servicio, recurso, sucursal);
                            this.setStoredData();
                            this.$state.go('recepcionturnos.asignarSobreturnoDNP', {
                                fecha: this.moment(this.fechaSeleccionada),
                                servicio: angular.copy(servicio),
                                recurso: angular.copy(recurso),
                                sucursal: angular.copy(sucursal)
                            });
                        }

                    }, undefined, this.optionsObj);
            } else {

                var servicio = this.obtenerServicioPorId(this.recursosSeleccionados[0].IdServicio);
                var recurso = {
                    Id: angular.copy(this.recursosSeleccionados[0].Id),
                    IdTipoRecurso: angular.copy(this.recursosSeleccionados[0].IdTipoRecurso),
                    Nombre: angular.copy(this.recursosSeleccionados[0].Nombre)
                };
                var sucursal = this.obtenerSucursalPorId(this.recepcionModel.IdSucursal);
                this.$log.debug("Antes de $state.go a DNP: fecha - servicio - recurso - sucursal", this.fechaSeleccionada, servicio, recurso, sucursal);
                this.setStoredData();
                this.$state.go('recepcionturnos.asignarSobreturnoDNP', {
                    fecha: this.moment(this.fechaSeleccionada),
                    servicio: angular.copy(servicio),
                    recurso: angular.copy(recurso),
                    sucursal: angular.copy(sucursal)
                });
            }


        }
    }

    asignarEsteTurno(pHoraTurno, pIdItemDePlantilla) {

        this.$log.debug('Asignar este turno - inicio. Hora/Item', pHoraTurno, pIdItemDePlantilla);
        var vm = this;
        // Valido que no se puedan dar turno en fechas anteriores a la actual
        // Si la fecha seleccionada es despues de la fecha actual -> recepto
        if (this.moment(this.fechaSeleccionada).isAfter(this.moment())) {

            irAReceptar();

        } else if (this.moment(this.fechaSeleccionada).isSame(this.moment(), 'day')) {


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
                this.AlertaService.NewWarning("Atención", "No se puede asignar un turno libre si el horario de atención ya fue superado (asigne un turno DNP)");
                return;

            } else {

                irAReceptar();
            }
        } else {
            this.$log.debug("Fecha anterior!");
            this.AlertaService.NewWarning("Atención", "No se puede asignar un turno libre con una fecha anterior a la actual");
            return;
        }

        function irAReceptar() {

            var servicio = vm.obtenerServicioPorId(vm.recursosSeleccionados[0].IdServicio);
            var recurso = {
                Id: vm.recursosSeleccionados[0].Id,
                IdTipoRecurso: vm.recursosSeleccionados[0].IdTipoRecurso,
                Nombre: vm.recursosSeleccionados[0].Nombre
            };
            var sucursal = vm.obtenerSucursalPorId(vm.recepcionModel.IdSucursal);

            var fechaTurno = vm.fechaSeleccionada;
            var horaTurno = pHoraTurno;
            var idItemDePlantilla = pIdItemDePlantilla;
            var fecha = vm.moment(vm.fechaSeleccionada);

            vm.$log.debug("Antes de $state.go a asignar turno desde Recepcion: fecha - hora - item - recurso - servicio - sucursal", vm.fechaSeleccionada, horaTurno, idItemDePlantilla, recurso, servicio, sucursal);
            vm.setStoredData();
            vm.$state.go('recepcionturnos.asignar', {
                fecha: fecha,
                hora: horaTurno,
                idItemDePlantilla: idItemDePlantilla,
                servicio: servicio,
                recurso: recurso,
                sucursal: sucursal
            });
        }
    }

    irAsignacionTurnos() {
        this.$state.go('main.signed.asignacionturno.list');
    }

    turnosPaciente() {
        this.TurnosCommonLogicService.openTurnosPaciente(null, true, false, false);
    }

    //endregion

    /* ------------------------------------------------- SUPPORT -------------------------------------------------- */
    // #region SUPPORT

    openReportes() {

        if (this.servicioRecepcionModel) {

            this.RecepcionTurnosLogicService.openReportesRecepcion(this.servicioRecepcionModel,
                this.fechaSeleccionada, this.serviciosXRecepcion, this.recepcionModel);
        } else {
            this.AlertaService.NewWarning("Atención", "Debe elegir un servicio")
        }
    }

    limpiarRecursosSeleccionados(recurso) {
        if (recurso) {
            angular.forEach(this.recursosXRecepcion, function (_recurso) {
                if (recurso.Id !== _recurso.Id)
                    _recurso.selected = false;
            });
        } else {
            angular.forEach(this.recursosXRecepcion, function (_recurso) {
                _recurso.selected = false;
            });
        }
    }

    setearDatosTurnos(pTurnos) {
        for (let index = 0; index < pTurnos.length; index++) {
            // pTurnos[index].SobreTurno = (pTurnos[index].EsSobreTurno) ? "SI" : "NO";
            pTurnos[index].Estado = (this.estadosDeTurnos.find(x => x.Id === pTurnos[index].IdEstado).Nombre) || "LIBRE";
            pTurnos[index].TipoTurno = (this.tiposDeTurnos.find(x => x.Id === pTurnos[index].IdTipoTurno).Nombre) || "";
            pTurnos[index].EstadoColor = (this.estadosDeTurnos.find(x => x.Id === pTurnos[index].IdEstado).Color) || "";
            pTurnos[index].IdRow = angular.copy(index);
        }

        pTurnos.forEach(turno => {
            if (turno.IdTipoTurno === 4) {
                turno.EstadoColor = 'color-violeta-turno-reservado';
            }
        });

        return pTurnos;
    }

    changeViewModel() {
        //cambiamos el switch para la vista
        //primero limpiamos variables

        if (this.schedulerOn) {
            this.inicializarScheduler();
            //una vez que inicializamos el scheduler, cargamos resources y eventos
            if (this.existenRecursosSeleccionados()) {
                angular.forEach(this.recursosXRecepcion, (_recurso) => {
                    if (_recurso.selected === true)
                        this.setearEventos(_recurso)
                })
            }
        } else if (!this.schedulerOn) {
            //voy a cambiar la vista a modo tabla
            //debo dejar un solo recurso seleccionado
            var _primerRecurso = this.recursosSeleccionados[0];
            this.limpiarRecursosSeleccionados(false);
            this.recursosXRecepcion.find(x => x.Id === _primerRecurso.Id).selected = true;
            this.toggleProfesional(_primerRecurso);
        }
    }

    existenRecursosSeleccionados() {
        var _ret = false;
        angular.forEach(this.recursosXRecepcion, (recurso) => {
            if (recurso.selected == true) _ret = true;
        });
        return _ret;
    }


    limpiar() {
        //voy a limpiar todo los combos y llamar al activate de nuevo
        delete this.recepcionModel;
        delete this.servicioRecepcionModel;
        this.recursosXRecepcion = {};
        this.recursosSeleccionados = [];
        this.inicializarDatos();
    }

    getCantidadProfesionalesSelected() {
        return this.RecepcionTurnosLogicService.getCantidadProfesionalesSelected(this.recursosXRecepcion);
    }

    getStatusFecha() {
        var status = true;
        if (this.soloRecursosConTurnosEnLaFecha) status = false;
        if (this.getCantidadProfesionalesSelected() != 0) status = false;

        return status;
    }

    limpiarDatosTurnos() {
        this.recursosSeleccionados = [];
        this.recursosXRecepcion = {};
    }

    incluirTurnosCancelados() {

        if (this.recursosXRecepcion) {
            var _recurso = this.recursosXRecepcion.find(x => x.selected === true)
            if (_recurso)
                this.toggleProfesional(_recurso);
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

    getInfoTieneDocumentos(item) {
        let str = '';
        if (item.TieneDocumentos) str = "Tiene Documentos Cargados";
        else str = "";

        return str;
    }

    //endregion

    /* ----------------------------------------- MENU CONTEXTUAL OPTIONS ------------------------------------------ */
    // #region MENU CONTEXTUAL

    inicializarMenuOptions() {
        this.menuOptions = [
            {
                text: 'Receptar',
                displayed: function () {
                    var idEstado = this.row.IdEstado;
                    // Se puede receptar si el estado es 1 (Asignado) o 7 (Ausente)
                    return (idEstado === 1 || idEstado === 7);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(1, $itemScope.row)
                    //$itemScope.vm.receptarTurno($itemScope.row);
                }
            },
            {
                text: 'Anular recepción',
                displayed: function () {
                    // Se puede anular la recepción solo si el estado es 2 (Receptado)
                    return (this.row.IdEstado === 2);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(2, $itemScope.row)
                    // $itemScope.vm.anularRecepcion($itemScope.row);
                }

            },
            {
                text: 'Editar paciente',
                displayed: function () {
                    // Se puede editar si tiene un paciente asignado
                    return (this.row.IdPaciente !== 0);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(3, $itemScope.row)
                    // $itemScope.vm.editarPacienteDelTurno($itemScope.row);
                }
            },
            {
                text: 'Editar financiador',
                displayed: function () {
                    // Se puede editar si tiene un paciente asignado 
                    // se pasa a False ya que no debemos dejar editar el financiador en recepcion
                    // pero si el financiador esta "no activo" lo debo mostrar para permitirle camibarselo
                    return (!this.row.MutualActiva);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(4, $itemScope.row)
                    // $itemScope.vm.editarFinanciadorDelTurno($itemScope.row);
                }
            },
            {
                text: 'Asignar este turno',
                displayed: function () {
                    // Se puede asignar solo si el estado es 8 (Libre)
                    return (this.row.IdEstado === 8);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    var horaTurno = $itemScope.row.Hora;
                    var idItemDePlantilla = $itemScope.row.IdItemPlantilla;
                    $itemScope.vm.asignarEsteTurno(horaTurno, idItemDePlantilla);
                }
            },
            {
                text: 'Anular',
                displayed: function () {
                    var idEstado = this.row.IdEstado;
                    // Se puede anular si el estado es 1 (Asignado) o 7 (Ausente)
                    return (idEstado === 1 || idEstado === 7);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(6, $itemScope.row)
                    // $itemScope.vm.anularTurno($itemScope.row);
                }
            },
            {
                text: 'Ver Auditoría',
                displayed: function () {
                    var idEstado = this.row.IdEstado;
                    // Se puede ver el log de auditoría salvo que el turno esté libre (8) o no este ausente (7)
                    return ((idEstado !== 8) && (idEstado !== 6 && this.row.IdPaciente !== 0));
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(7, $itemScope.row)
                }
            },
            {
                text: 'Marcar como Pagado',
                displayed: function () {
                    var idEstado = this.row.IdEstado;
                    // Se puede marcar como pagado manual si el turno está receptado por lo menos, y está pendiente de cobro ($ rojo)
                    return ((idEstado === 2 || idEstado === 3 || idEstado === 4) && this.row.IdEstadoCobranzaCaja == 2);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(8, $itemScope.row)
                }
            },
            {
                text: 'Anular marcado como Pagado',
                displayed: function () {
                    var idEstado = this.row.IdEstado;
                    // Se puede anular la marca de pago manual si el turno está receptado por lo menos, y estaba pagado manual ($ verde)
                    return ((idEstado === 2 || idEstado === 3 || idEstado === 4) && this.row.IdEstadoCobranzaCaja == 3);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(9, $itemScope.row)
                }
            },
            {
                text: 'Enviar a Caja',
                displayed: function () {
                    var idEstado = this.row.IdEstado;
                    // Se puede enviar a Caja si el turno está receptado por lo menos, y está pendiente de cobro ($ rojo)
                    return ((idEstado === 2 || idEstado === 3 || idEstado === 4) && this.row.IdEstadoCobranzaCaja == 2);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(10, $itemScope.row)
                }
            },
            {
                text: 'Editar Recepción',
                displayed: function () {
                    var idEstado = this.row.IdEstado;
                    // Se puede ver el log de auditoría salvo que el turno esté libre (8)
                    return ((idEstado === 2 || idEstado === 3 || idEstado === 4) && this.row.NoPrefactura == false);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(11, $itemScope.row)
                }
            },
            {
                text: 'Imprimir Orden',
                displayed: function () {
                    var idEstado = this.row.IdEstado;

                    return (idEstado === 2 || idEstado === 3 || idEstado === 4);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(12, $itemScope.row)
                }
            },
            {
                text: 'Ver Turnos Paciente',
                displayed: function () {
                    // Se puede ver turnos si tiene un paciente asignado
                    return (this.row.IdPaciente !== 0);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(13, $itemScope.row)

                }
            },
            {
                text: 'Ver Motivo Cancelación Turno',
                displayed: (modelValue)  => {
                    if (this.permisoVerMotivoDeReceso === false) return false;
                    
                    // Se puede ver turnos si el turno esta cancelado
                    var idEstado = modelValue.row.IdEstado;

                    return (idEstado === 6 && modelValue.row.IdPaciente !== 0);
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
                text: 'Documentos',
                displayed: function () {
                    // Se puede ver documentos si tiene un paciente asignado
                    return (this.row.IdPaciente !== 0);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(16, $itemScope.row)

                }
            },
            {
                text: 'Rellamar Paciente',
                displayed: function () {
                    var idEstado = this.row.IdEstado;
                    // se puede rellamar si el estado del turno es:
                    // Receptado (2) / Atendiendo (3) / Atendido (4)
                    return (idEstado == 2 || idEstado == 3 || idEstado == 4);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(17, $itemScope.row)
                }
            },
            {
                text: 'Enviar a Efector',
                displayed: function () {
                    var idEstado = this.row.IdEstado;
                    // se puede enviar a efector si el servicio es efector, se envia opcionalmente y
                    // el turno está Receptado (2) o Atendiendo (3)
                    return (idEstado == 2 || idEstado == 3) && this.row.EsEfector;
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(22, $itemScope.row)
                    // $itemScope.vm.anularRecepcion($itemScope.row);
                }

            },
            {
                text: 'Iniciar Atención',
                displayed: function () {
                    // Se puede ver turnos si el turno esta cancelado
                    var idEstado = this.row.IdEstado;
                    // voy a poder iniciar la atencion si el turno esta en receptado (2)
                    return (idEstado == 2);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(18, $itemScope.row)

                }
            },
            {
                text: 'Anular Inicio Atención',
                displayed: function () {
                    // Se puede ver turnos si el turno esta cancelado
                    var idEstado = this.row.IdEstado;

                    // voy a poder iniciar la atencion si el turno esta en atendiendo (3)
                    return (idEstado == 3);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(19, $itemScope.row)

                }
            },
            {
                text: 'Finalizar Atención',
                displayed: function () {
                    // Se puede ver turnos si el turno esta cancelado
                    var idEstado = this.row.IdEstado;

                    // voy a poder FINALIZAR la atencion si el turno esta en atendiendo (3)
                    return (idEstado == 3);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(20, $itemScope.row)

                }
            },
            {
                text: 'Anular Finalizar Atención',
                displayed: function () {
                    // Se puede ver turnos si el turno esta cancelado
                    var idEstado = this.row.IdEstado;

                    // voy a poder anular el FINALIZAR la atencion si el turno esta en atendiendo (4)
                    return (idEstado == 4);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.accionTurno(21, $itemScope.row)

                }
            },
            {
                text: 'Sin acciones disponibles',
                displayed: function () {
                    // Se puede ver turnos si el turno esta cancelado y no hay un paciente asignado
                    var idEstado = this.row.IdEstado;

                    return (idEstado === 6 && this.row.IdPaciente === 0);
                },
                click: ($itemScope, $event, modelValue, text, $li) => {

                }, enabled: false
            }
        ];
    }

    inicializarMenuOptionsProfesional() {

        this.menuOptionsProfesional = [
            {
                text: 'Ver Agenda',
                displayed: () => {
                    if (this.servicioRecepcionModel)
                        return true;
                    else return false;
                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    // levantamos agenda de profesional
                    //levantamos la agenda por id
                    this.$log.debug('modelValue', modelValue);
                    this.PlantillaLogicService.viewPlantilla(0, this.servicioRecepcionModel, $itemScope.recurso)
                }
            },
            {
                text: 'Sin Acciones Disponibles',
                displayed: () => {
                    if (!this.servicioRecepcionModel)
                        return true;
                    else return false;
                },
                enabled: false
            }
        ];
    }
    //endregion

    /* ------------------------------------------------ CALENDAR -------------------------------------------------- */
    // #region CALENDAR
    inicializarScheduler() {
        var vm = this;

        this.uiConfig = {
            scheduler: {
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                defaultView: 'agendaDay',
                //locale: 'es',
                height: 480,
                ignoreTimezone: false,
                timezone: 'local',
                ///
                slotDuration: '00:02:00',
                slotLabelInterval: 3,
                // slotLabelFormat: 'hh(:mm)',
                slotMinutes: 3,
                scrollTime: this.moment.duration(this.moment().subtract(this.timePrevScheduler, 'm').format('HH:mm:ss')),
                ///
                allDaySlot: false,
                eventOverlap: false,
                columnFormat: 'dddd',
                timeFormat: 'HH:mm',
                slotLabelFormat: 'HH:mm',
                nowIndicator: true,
                editable: false,
                selectable: false,
                eventLimit: false, // allow "more" link when too many events
                customButtons: {
                    timeNowButton: {
                        text: 'Hora Actual',
                        click: () => {
                            this.scrollScheduler();
                            this.calendarRender();
                        }
                    }
                },
                header: {
                    left: '',
                    center: "title",
                    right: 'timeNowButton'
                },
                titleFormat: 'dddd DD [de] MMMM [de] YYYY',
                //// uncomment this line to hide the all-day slot
                //allDaySlot: false,
                resources: [],
                events: [],
                eventClick: (calEvent, jsEvent, view) => {

                    if (jsEvent.target.id === 'Options') {
                        //vamos a levantar opciones
                        //iguales a el menu contextual
                        var options;
                        options = this.RecepcionTurnosLogicService.obtenerOptionsEvent(calEvent);

                        this.ModalService.selectOptionModal(options)
                            .then((pResult) => {

                                this.$log.debug('pResult', pResult);
                                if (pResult.id == 5) {
                                    var horaTurno = calEvent.Hora;
                                    var idItemDePlantilla = calEvent.IdItemPlantilla;
                                    this.asignarEsteTurno(horaTurno, idItemDePlantilla);
                                } else
                                    this.accionTurno(pResult.id, calEvent);

                            }, (pError) => {
                                this.$log.error('pError', pError);
                            });
                    }

                },
                eventRender: (event, element) => {

                    element.find('.fc-time').attr('style', 'font-size: 1.45em !important; color: black;');
                    element.find('.fc-time').append('<span class="removeEvent glyphicon ' +
                        'glyphicon-option-horizontal pull-right" id="Options" style="margin-left: 3px; margin-top:6px; margin-right: 10px; font-size:16px;padding-right: 16px;"></span>');

                    element.find('.fc-time').attr('style', 'color: black !important; font-size: 1.35em !important');
                    element.find('.fc-title').attr('style', 'color: black !important; font-size: 1.10em !important');

                    element.find('.fc-title').append("<br/> ESTADO: " + event.EstadoTurno);
                    element.find('.fc-title').append("<br/> COBERTURA: " + event.MutualYPlan);
                    element.find('.fc-title').append("<br/> TIPO TURNO: " + event.TipoTurno);
                    element.find('.fc-title').append("<br/> PRESTACION: " + event.Prestaciones);
                    element.find('.fc-title').append("<br/> OBSERVACION: " + event.Observaciones);

                    //Event double click: Editar el item	
                    element.bind('dblclick', () => {

                        this.$log.error('double click');
                        //vamos a levantar opciones 
                        //iguales a el menu contextual
                        var options;
                        options = this.RecepcionTurnosLogicService.obtenerOptionsEvent(event);

                        this.ModalService.selectOptionModal(options)
                            .then((pResult) => {

                                this.$log.debug('pResult', pResult);
                                if (pResult.id == 5) {
                                    var horaTurno = event.Hora;
                                    var idItemDePlantilla = event.IdItemPlantilla;
                                    this.asignarEsteTurno(horaTurno, idItemDePlantilla);
                                } else
                                    this.accionTurno(pResult.id, event);
                            }, (pError) => {
                                this.$log.error('pError', pError);
                            });
                    });
                }
            }
        };
    }


    calendarRender() {
        this.$timeout(() => this.uiCalendarConfig.calendars.scheduler.fullCalendar('render'), 100);
    }

    scrollScheduler() {
        this.uiConfig.scheduler.scrollTime = this.moment.duration(this.moment().subtract(this.timePrevScheduler, 'm').format('HH:mm:ss'));
    }



    setearEventos(recurso) {

        var _recurso = {
            id: recurso.Id,
            title: recurso.Nombre
        }
        this.uiConfig.scheduler.resources.push(_recurso);
        //vamos a consultar los eventos que tiene ese recurso para esa busqueda
        var _turnos = this.recursosXRecepcion.find(x => x.Id === recurso.Id).Turnos;
        //despues agregamos el evento en base a lo obtenido
        angular.forEach(_turnos, (_evento) => {
            this.nuevoEvento(_evento, recurso);
        })
        this.calendarRender();

    }

    nuevoEvento(dataEvent, recurso) {

        var newEvent: any = {};

        newEvent.start = this.moment(dataEvent.Hora, 'HH:mm');
        newEvent.end = this.moment(dataEvent.Hora, 'HH:mm').add(15, 'm');

        if (this.uiConfig.scheduler.events.length === 0) {
            newEvent.IdEvent = 0;
        } else {
            newEvent.IdEvent =
                this.uiConfig.scheduler.events[this.uiConfig.scheduler.events.length - 1].IdEvent + 1;
        }
        newEvent.title = angular.copy(dataEvent.Paciente);
        newEvent.resourceId = recurso.Id;
        newEvent.Paciente = angular.copy(dataEvent.Paciente);
        newEvent.Id = angular.copy(dataEvent.Id);
        newEvent.Hora = angular.copy(dataEvent.Hora);
        newEvent.IdItemPlantilla = angular.copy(dataEvent.IdItemPlantilla);
        newEvent.IdEstado = angular.copy(dataEvent.IdEstado);
        newEvent.EstadoTurno = this.estadosDeTurnos.find(x => x.Id === newEvent.IdEstado).Nombre;
        newEvent.EstadoColor = angular.copy(dataEvent.EstadoColor);
        newEvent.MutualYPlan = angular.copy(dataEvent.MutualYPlan);
        newEvent.IdTipoTurno = angular.copy(dataEvent.IdTipoTurno);
        newEvent.TipoTurno = this.tiposDeTurnos.find(x => x.Id === newEvent.IdTipoTurno).Nombre;
        newEvent.Prestaciones = angular.copy(dataEvent.Prestaciones);
        newEvent.allDay = false;
        newEvent.backgroundColor = this.RecepcionTurnosLogicService.getColorEstadoTurno(dataEvent.EstadoColor);
        newEvent.eventTextColor = 'black';
        newEvent.title = dataEvent.Estado;

        this.uiConfig.scheduler.events.push(newEvent);

    }
    //endregion

    /* ------------------------------------------------- STORAGE -------------------------------------------------- */
    // #region STORAGE
    getStoredData() {
        var vm = this;

        if (this.StorageService.existStoredObjects(this.storageKeys.keyRecepcion)) {
            getData(this.StorageService.getStorageObj(this.storageKeys.keyRecepcion));
            this.cleanStorage();
        } else {
            //consulto si la fecha seleccionada es feriado
            this.esFechaFeriado();
        }

        function getData(stored) {

            vm.recepcionModel = stored.recepcion ? angular.copy(stored.recepcion) : {};
            vm.schedulerOn = stored.schedulerOnOff ? angular.copy(stored.schedulerOnOff) : false;
            vm.soloRecursosConTurnosEnLaFecha = stored.soloRecursosConTurnos ? angular.copy(stored.soloRecursosConTurnos) : false;
            vm.fechaSeleccionada = stored.fechaSeleccionada ? vm.moment(stored.fechaSeleccionada, 'DD-MM-YYYY').toDate() : new Date();
            vm.idTurnoEnviarAEfector = stored.idTurnoEnviarAEfector;

            //consulto si la fecha seleccionada es feriado
            vm.esFechaFeriado();

            //Despues de inicializar 
            vm.getServiciosPorRecepcion()
                .then((pOk) => {
                    vm.servicioRecepcionModel = stored.servicioRecepcion ? angular.copy(stored.servicioRecepcion) : null;
                    if (!vm.servicioRecepcionModel) {
                        vm.getRecursosPorRecepcion()
                            .then(getRecursosOk, getRecursosError);
                    }
                    else {
                        vm.getRecursosPorRecepcionYServicio()
                            .then(getRecursosOk, getRecursosError);
                    }

                    function getRecursosOk(recursosOk) {
                        vm.$log.debug('getStoredDataOk');
                        if (stored.recursosSeleccionados) {
                            vm.recursosSeleccionados = angular.copy(stored.recursosSeleccionados);
                            angular.forEach(vm.recursosSeleccionados, (_recursoSeleccionado) => {
                                if (vm.recursosXRecepcion.find(x => x.Id === _recursoSeleccionado.Id)) {
                                    vm.toggleProfesional(_recursoSeleccionado);
                                    vm.recursosXRecepcion.find(x => x.Id === _recursoSeleccionado.Id).selected = true;
                                }
                            });
                        }
                    }
                    function getRecursosError(recursosError) {
                        vm.$log.debug('getStoredDataError');
                    }
                }, (pError) => {
                    return;
                });
   
        }
    }

    cleanStorage() {
        this.StorageService.cleanStorage(this.storageKeys.keyRecepcion);
    }

    setStoredData() {
        var recepcionStorageData = {
            recepcion: angular.copy(this.recepcionModel) || null, // ✔
            schedulerOnOff: angular.copy(this.schedulerOn), // ✔
            servicioRecepcion: angular.copy(this.servicioRecepcionModel) || null, // ✔
            fechaSeleccionada: angular.copy(this.moment(this.fechaSeleccionada).format("DD-MM-YYYY")) || null, // ✔
            soloRecursosConTurnos: angular.copy(this.soloRecursosConTurnosEnLaFecha), // ✔
            recursosSeleccionados: angular.copy(this.recursosSeleccionados) || null, // ✔
            idTurnoEnviarAEfector: angular.copy(this.idTurnoEnviarAEfector)
        }
        this.StorageService.setStorageObj(this.storageKeys.keyRecepcion, recepcionStorageData);

    }
    //endregion

    /* ---------------------------------------------- OPTIONS MENU ------------------------------------------------ */
    // #region OPTIONS MENU


    accionTurno(idAccion, turno) {

        switch (idAccion) {
            case 1:
                this.receptarTurno(turno);
                break;
            case 2:
                this.anularRecepcion(turno)
                break;
            case 3:
                this.editarPacienteDelTurno(turno)
                break;
            case 4:
                this.editarFinanciadorDelTurno(turno)
                break;
            case 5:
                //evento de asignar turno
                break;
            case 6:
                this.anularTurno(turno)
                break;
            case 7:
                this.verAuditoriaDelTurno(turno);
                break;
            case 8:
                this.marcarTurnoComoPagado(turno);
                break;
            case 9:
                this.anularMarcadoTurnoComoPagado(turno);
                break;
            case 10:
                this.enviarTurnoACaja(turno);
                break;
            case 11:
                this.editarRecepcion(turno);
                break;
            case 12:
                this.imprimirOrden(turno);
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
                this.verDocumnentos(turno);
                break;
            case 17:
                this.rellamarPaciente(turno);
                break;
            case 18:
                this.iniciarAtencion(turno);
                break;
            case 19:
                this.anularIniciarAtencion(turno);
                break;
            case 20:
                this.finalizarAtencion(turno);
                break;
            case 21:
                this.anularFinalizarAtencion(turno);
                break;
            case 22:
                this.enviarAEfector(turno);
                break;
        }
    }

    verDocumnentos(pRowTurno) {
        this.$log.debug('Ver Documentos ', pRowTurno);
        this.RecepcionTurnosLogicService.openDocumentosRecepcion(pRowTurno.Id)
            .then((pResult) => {
                this.$log.debug('pResult', pResult);
                var _recurso = this.recursosXRecepcion.find(x => x.selected === true)
                if (_recurso)
                    this.toggleProfesional(_recurso);
            }, (pError) => {
                this.$log.error('pError', pError);
            });
    }

    rellamarPaciente(pRowTurno) {
        this.$log.debug('Rellamar paciente ', pRowTurno);

        this.ModalService.confirm('¿Está seguro que desea rellamar al Paciente ' + pRowTurno.Paciente + '?',
            (_pOk) => {
                if (_pOk) {
                    //ANULAR O CANCELAR TURNO
                    this.TurnoDataService.rellamarPorTurno(pRowTurno.Id)
                        .then((rellamarTurnoOk) => {
                            if (rellamarTurnoOk) {
                                this.AlertaService.NewSuccess("Paciente Rellamado");
                            }
                        }, (anularTurnoError) => {
                            this.$log.error('error anulrTurno', anularTurnoError);
                        })
                }
            }, "", this.optionsObj);
    }

    enviarAEfector(pRowTurno){
        this.$log.debug('Enviar a efector ', pRowTurno);

        this.ModalService.confirm('¿Está seguro que desea enviar al servicio efector?',
            (_pOk) => {
                if (_pOk) {
                    //Enviar manualmente a servicio efector 
                    this.TurnoDataService.enviarAEfectorTurnoManualmente(pRowTurno.Id)
                        .then((enviarEfectorOk) => {
                            if (enviarEfectorOk) {
                                this.AlertaService.NewSuccess("Turno enviado correctamente");
                            }
                        }, (enviarEfectorError) => {
                            this.$log.error('error envio a efector', enviarEfectorError);
                        })
                }
            }, "", this.optionsObj);
    }

    receptarTurno(pRowTurno) {
        this.$log.debug('Receptar este turno ', pRowTurno);
        //Se comenta la consulta de recepcion, para hacerlo mas dinamico.

        // this.ModalService.confirm('¿Está seguro que desea receptar el turno de las ' + pRowTurno.Hora + '?',
        //     (_pOk) => {
        //         if (_pOk) {
        //             this.setStoredData();
        // 			this.$state.go('prefacturacion.ambulatorio.new',{
        // 				esNuevo: false,
        //                 id: pRowTurno.Id,
        //                 idAmbito: this.ORIGEN_PREFACTURA.TURNO
        // 			}
        // 		);
        //         }
        //     }, "", this.optionsObj);

        // tengo que validar la recepcion delturn
        this.loading = true;
        this.TurnoDataService.validarReceptarTurno(pRowTurno.Id)
            .then((pResponse) => {

                this.$log.debug('pResponse Validar Receptar Turno', pResponse);
                if (pResponse.IsOk) {
                    // seteo datos de guardado y voy a prefacturar

                    if(pResponse.RecepcionaSinPrefacturar){
                        this.TurnoDataService.receptarTurno(pRowTurno.Id)
                            .then((pResponseReceptar) => {
                                if (pResponseReceptar.IsOk) {
                                    if(pResponseReceptar.EsEfector) {
                                        if(pResponseReceptar.EnvioEfectorOpcional) {
                                            this.ModalService.confirm('¿Quiere enviar al efector?',
                                            (_pOk) => {
                                                if (_pOk) {
                                                    this.TurnoDataService.enviarAEfector(pRowTurno.Id)
                                                    .then((pResponseEnviar) => {
                                                        if (!pResponseEnviar.IsOk) {                                                            
                                                            this.$log.debug('pResponse NOT OK');
                                                            this.loading = false;
                                                            if (pResponseEnviar.Message !== null)
                                                                this.AlertaService.NewError(pResponseEnviar.Message);
                                                            else
                                                                this.AlertaService.NewError("Error De Servidor");
                                                        }
                                                    }, (pErrorReceptar) => {
                                                        this.$log.error('Receptar Turno .-', pErrorReceptar);
                                                        this.loading = false;
                                                    });
                                                }
                                            }, "", this.optionsObj);
                                        } else {
                                            this.TurnoDataService.enviarAEfector(pRowTurno.Id)
                                            .then((pResponseEnviar) => {
                                                if (!pResponseEnviar.IsOk) {                                                            
                                                    this.$log.debug('pResponse NOT OK');
                                                    this.loading = false;
                                                    if (pResponseEnviar.Message !== null)
                                                        this.AlertaService.NewError(pResponseEnviar.Message);
                                                    else
                                                        this.AlertaService.NewError("Error De Servidor");
                                                }
                                            }, (pErrorReceptar) => {
                                                this.$log.error('Receptar Turno .-', pErrorReceptar);
                                                this.loading = false;
                                            });
                                        }                                        
                                    }
                                    this.refrescar();    
                                } else {
                                    this.$log.debug('pResponse NOT OK');
                                    this.loading = false;
                                    if (pResponse.Message !== null)
                                        this.AlertaService.NewError(pResponse.Message);
                                    else
                                        this.AlertaService.NewError("Error De Servidor");
                                }
                            }, (pErrorReceptar) => {
                                this.$log.error('Receptar Turno .-', pErrorReceptar);
                                this.loading = false;
                            })
                    }
                    else {
                        if(pRowTurno.EsEfector && (pRowTurno.EnvioEfectorOpcional || this.recursosSeleccionados[0].EnvioEfectorOpcional) && (pRowTurno.IdEstado == 1 || pRowTurno.IdEstado == 7))
                        {
                            this.idTurnoEnviarAEfector = pRowTurno.Id;
                        }
                                                   
                        this.setStoredData();
                        this.loading = false;
                        this.$state.go('prefacturacion.ambulatorio.new', {
                            esNuevo: false,
                            id: pRowTurno.Id,
                            idAmbito: this.ORIGEN_PREFACTURA.TURNO
                        });
                        
                    }                    
                } else {
                    this.$log.debug('pResponse NOT OK');
                    this.loading = false;
                    if (pResponse.Message !== null)
                        this.AlertaService.NewError(pResponse.Message);
                    else
                        this.AlertaService.NewError("Error De Servidor");
                }

            }, (pError) => {
                this.$log.error('Validacion  Validar Receptar Turno .-', pError);
                this.loading = false;
            })

    }

    editarRecepcion(turno) {

        this.setStoredData();
        this.$state.go('prefacturacion.ambulatorio.new', {
            esNuevo: false,
            id: turno.Id,
            idAmbito: this.ORIGEN_PREFACTURA.TURNO_EDICION
        });

    }

    imprimirOrden(turno) {
        this.AutorizadorDataService.getOrdenPracticaPorTurno(turno.Id)
            .then((result) => {
                this.AutorizadorDataService.ordenPractica = result;
                this.AutorizadorLogicService.printOrdenPractica();
            });
    }


    anularRecepcion(pRowTurno) {
        this.$log.debug('Anular recepción de este turno ', pRowTurno);
        this.RecepcionTurnosLogicService.openAnularRecepcion(pRowTurno).then((motivoAnulacion) => {
            this.motivoAnulacion = motivoAnulacion

            this.$log.debug('MOTIVO ANULACION - OBSERVACIOsNES ', motivoAnulacion);

            this.loading = true;
            // this.TurnoDataService.validarAnularRecepcion(pRowTurno.Id)
            //     .then((pResponse) => {
            //         if (pResponse.IsOk === true) {
            //             this.loading = true;
                        this.$log.debug('ENVIO A BACK!  - ', pRowTurno.Id, this.motivoAnulacion)
                        this.TurnoDataService.actualizarObservacionesPrincipales(pRowTurno.Id, this.motivoAnulacion).then((pResponse) => {
                            this.$log.debug('RESPUESTA actualizarObservacionesPrincipales - ', pResponse)

                            if (pResponse.IsOk === true) {
                                this.loading = true;
                                this.TurnoDataService.anularRecepcionConMotivo(pRowTurno.Id, this.motivoAnulacion ? this.motivoAnulacion : "")
                                    .then((pResp) => {

                                        if (pResp.IsOk) {

                                            this.AlertaService.NewSuccess("Recepción Anulada");
                                            this.loading = false;
                                            //recepcion correctamente anulada
                                            //cargamos los datos nuevamente
                                            var _recurso = this.recursosXRecepcion.find(x => x.selected === true)
                                            if (_recurso)
                                                this.toggleProfesional(_recurso);
                                        } else { 
                                            this.loading = false;
                                            this.AlertaService.NewError(pResp.Message);    
                                        }

                                    }).catch(function (pErr) {
                                        this.loading = false;
                                        this.AlertaService.NewError("Error En Anular Recepcion");
                                    });
                            }
                        });
                //     } else {
                //         if (pResponse.Message !== null)
                //             this.AlertaService.NewError(pResponse.Message);
                //         else
                //             this.AlertaService.NewError("Error De Servidor");
                //         this.loading = false;
                //     }
                // }).catch((pError) => {
                //     this.$log.error('Validacion Activar .-', pError);
                //     this.loading = false;
                // });
        });
    }

    editarPacienteDelTurno(pRowTurno) {
        this.$log.debug('Editar paciente del turno: ', pRowTurno);
        this.setStoredData();

        //DEPRECADO => apunta a paciente edit en appv2
        //this.$state.go('paciente.edit', { idPaciente: pRowTurno.IdPaciente });
        window.location.href = `${this.ENV.APP2}/paciente/edit/` + pRowTurno.IdPaciente;
    }

    editarFinanciadorDelTurno(pRowTurno) {
        this.$log.debug('Editar financiador del turno: ', pRowTurno);
        this.loading = true;
        this.SupportDataService.getAllCoberturasPaciente(pRowTurno.IdPaciente)
            .then((coberturas) => {

                this.loading = false;
                this.ModalService.selectOptionModal(this.RecepcionTurnosLogicService.getOpcionesCobertura(coberturas))
                    .then((pResult) => {
                        this.$log.debug('pResult', pResult);
                        this.loading = true;
                        this.TurnoDataService.actualizarMutualPlan(pRowTurno.Id, pResult.idMutual, pResult.idPlanMutual)
                            .then((mutualOk) => {
                                this.$log.debug('mutualOk', mutualOk);
                                this.loading = false;

                                this.AlertaService.NewSuccess("Mutual cambiada correctamente");
                                var _recurso = this.recursosXRecepcion.find(x => x.selected === true)
                                if (_recurso)
                                    this.toggleProfesional(_recurso);
                            }, (mutualError) => {
                                this.$log.error('mutualError', mutualError);
                                this.loading = false;

                            })
                    }, (pError) => {
                        this.$log.error('pError', pError);
                        this.loading = false;

                    });

            });
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
                                var _recurso = this.recursosXRecepcion.find(x => x.selected === true)
                                if (_recurso)
                                    this.toggleProfesional(_recurso);
                            }
                        }, (anularTurnoError) => {
                            this.$log.error('error anulrTurno', anularTurnoError);
                        })
                }
            }, "", this.optionsObj);
    }
    verAuditoriaDelTurno(pRowTurno) {
        this.$log.debug('Ver auditoría del turno ', pRowTurno);
        this.TurnosLogicService.verLogDeAuditoria(pRowTurno.Id);
    }

    marcarTurnoComoPagado(turno) {

        this.ModalService.confirm('¿Está seguro que desea marcar el turno como pagado?',
            (_pOk) => {
                if (_pOk) {
                    this.loading = true;
                    this.TurnoDataService.marcarTurnoComoPagado(turno.Id)
                        .then((pResp) => {
                            this.AlertaService.NewSuccess("Turno marcado como pagado");
                            this.loading = false;
                            //cargamos los datos nuevamente
                            var _recurso = this.recursosXRecepcion.find(x => x.selected === true)
                            if (_recurso)
                                this.toggleProfesional(_recurso);
                        }).catch(function (pErr) {
                            this.loading = false;
                            this.AlertaService.NewError("Error En Marcar turno como pagado");
                        });
                }
            }, "", this.optionsObj);
    }

    anularMarcadoTurnoComoPagado(turno) {

        this.ModalService.confirm('¿Está seguro que desea anular el turno como pagado?',
            (_pOk) => {
                if (_pOk) {
                    this.loading = true;
                    this.TurnoDataService.anularMarcadoTurnoComoPagado(turno.Id)
                        .then((pResp) => {
                            this.AlertaService.NewSuccess("Turno anulado como pagado");
                            this.loading = false;
                            //cargamos los datos nuevamente
                            var _recurso = this.recursosXRecepcion.find(x => x.selected === true)
                            if (_recurso)
                                this.toggleProfesional(_recurso);
                        }).catch(function (pErr) {
                            this.loading = false;
                            this.AlertaService.NewError("Error En Anular turno como pagado");
                        });
                }
            }, "", this.optionsObj);
    }

    enviarTurnoACaja(turno) {

        this.ModalService.confirm('¿Está seguro que desea enviar el turno a Caja?',
            (_pOk) => {
                if (_pOk) {
                    this.loading = true;
                    this.TurnoDataService.enviarTurnoACaja(turno.Id)
                        .then((pResp) => {
                            if (pResp.IsOk === true) {
								this.AlertaService.NewSuccess("Turno enviado a Caja");
                                this.loading = false;
                                //cargamos los datos nuevamente
                                var _recurso = this.recursosXRecepcion.find(x => x.selected === true)
                                if (_recurso)
                                    this.toggleProfesional(_recurso);
							} else {
								if (pResp.Message != null)
									this.AlertaService.NewError("", pResp.Message);
								else
									this.AlertaService.NewError("", "Error");
								this.loading = false;
							}                            
                        }).catch(function (pErr) {
                            this.loading = false;
                            this.AlertaService.NewError("Error al enviar el turno a Caja");
                        });
                }
            }, "", this.optionsObj);
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
                }
                else {
                    this.AlertaService.NewWarning("No existe ninguna observación");
                }
            }, (pObservacionError) => {
                this.loading = false;

                this.$log.error('Obtener ObservacionError', pObservacionError);
            })
    }

    iniciarAtencion(pRowTurno) {
        this.$log.debug('iniciarAtencion ', pRowTurno);
        this.TurnoDataService.iniciarAtencion(pRowTurno.Id)
            .then((pResult) => {
                this.$log.debug('pResult', pResult);
                this.AlertaService.NewSuccess("Atención Iniciada");
                var _recurso = this.recursosXRecepcion.find(x => x.selected === true)
                if (_recurso)
                    this.toggleProfesional(_recurso);
            }, (pError) => {
                this.$log.error('pError', pError);
            });

    }
    anularIniciarAtencion(pRowTurno) {
        this.$log.debug('anularIniciarAtencion ', pRowTurno);
        this.TurnoDataService.anularIniciarAtencion(pRowTurno.Id)
            .then((pResult) => {
                this.$log.debug('pResult', pResult);
                this.AlertaService.NewSuccess("Inicio Atención Anulada");
                var _recurso = this.recursosXRecepcion.find(x => x.selected === true)
                if (_recurso)
                    this.toggleProfesional(_recurso);
            }, (pError) => {
                this.$log.error('pError', pError);
            });
    }

    finalizarAtencion(pRowTurno) {
        this.$log.debug('finalizarAtencion ', pRowTurno);
        this.TurnoDataService.finalizarAtencion(pRowTurno.Id)
            .then((pResult) => {
                this.$log.debug('pResult', pResult);
                this.AlertaService.NewSuccess("Atención Finalizada");
                var _recurso = this.recursosXRecepcion.find(x => x.selected === true)
                if (_recurso)
                    this.toggleProfesional(_recurso);
            }, (pError) => {
                this.$log.error('pError', pError);
            });

    }
    anularFinalizarAtencion(pRowTurno) {
        this.$log.debug('anularFinalizarAtencion ', pRowTurno);
        this.TurnoDataService.anularFinalizarAtencion(pRowTurno.Id)
            .then((pResult) => {
                this.$log.debug('pResult', pResult);
                this.AlertaService.NewSuccess("Finalizar Atención Anulado");
                var _recurso = this.recursosXRecepcion.find(x => x.selected === true)
                if (_recurso)
                    this.toggleProfesional(_recurso);
            }, (pError) => {
                this.$log.error('pError', pError);
            });
    }

    verCalendarioRecurso() {

        this.$log.debug('verCalendrioRecurso');
        if(this.recursosSeleccionados && this.recursosSeleccionados.length){

            var servicio = this.obtenerServicioPorId(this.recursosSeleccionados[0].IdServicio);
            
            var recurso = {
                Id: angular.copy(this.recursosSeleccionados[0].Id),
                IdTipoRecurso: angular.copy(this.recursosSeleccionados[0].IdTipoRecurso),
                Nombre: angular.copy(this.recursosSeleccionados[0].Nombre)
            };
            var sucursal = this.obtenerSucursalPorId(this.recepcionModel.IdSucursal);
            this.TurnosCommonLogicService.openCalendarioTurnosPorRecurso(recurso, servicio,sucursal, true)
            .then( (pResultDiaSeleccionado) => {
                this.$log.debug('pResultDiaSeleccionado',pResultDiaSeleccionado);
                this.fechaSeleccionada = angular.copy(pResultDiaSeleccionado.toDate());
                this.changeFechaSeleccionada();
            }, (pError) => {
                this.$log.error('pError',pError);
            });
        }else {
            this.AlertaService.NewWarning("Seleccione un profesional");
        }
    }

    //endregion

    /* -------------------------------------------- BUSCADOR PACIENTE --------------------------------------------- */
    // #region BUSCADOR PACIENTE

    changeFilterPaciente() {
        this.$log.debug('changeFilterPaciente ', this.filterBuscarPaciente);
        if (this.filterBuscarPaciente) {
            var _pacientesTurnos = this.recursosSeleccionados[0].Turnos.filter(x =>
                x.Paciente.includes(this.filterBuscarPaciente.toUpperCase())
                || x.NumeroDocumento.includes(this.filterBuscarPaciente));

            this.$log.debug('_pacientesTurnos ', _pacientesTurnos);
            //tengo los turnos de los paciente con el nombre parecido
            // puedo tener 1: caso ideal voy y busco

            if (_pacientesTurnos.length === 1) {
                angular.forEach(this.recursosSeleccionados[0].Turnos, (_turno) => {
                    angular.forEach(_pacientesTurnos, (turnoPaciente) => {
                        if (turnoPaciente.Id === _turno.Id) {
                            this.recursosSeleccionados[0].Turnos.find(x => x.Id == turnoPaciente.Id).selected = true;

                            this.scrollTableTurnos(this.recursosSeleccionados[0].Turnos.find(x => x.Id == turnoPaciente.Id).IdRow);
                        }
                    })

                });
            } else if (_pacientesTurnos.length > 1) {
                // tengo mas de uno: entonces tengo que scrollear hasta el primero
                angular.forEach(this.recursosSeleccionados[0].Turnos, (_turno) => {
                    angular.forEach(_pacientesTurnos, (turnoPaciente) => {
                        if (turnoPaciente.Id === _turno.Id) {
                            this.recursosSeleccionados[0].Turnos.find(x => x.Id == turnoPaciente.Id).selected = true;
                        }
                    })
                });
                this.scrollTableTurnos(this.recursosSeleccionados[0].Turnos.find(x => x.Id == _pacientesTurnos[0].Id).IdRow);

            }
            else this.limpiarTurnosSelected();
        } else this.limpiarTurnosSelected();
    }

    limpiarTurnosSelected() {
        angular.forEach(this.recursosSeleccionados[0].Turnos, (_turno) => {
            this.recursosSeleccionados[0].Turnos.find(x => x.Id == _turno.Id).selected = false;
        })
    }

    scrollTableTurnos(IdRow) {
        var elm: any = $(".bodyturnos");
        var elmRow: any = $(".rowturnos");

        var vm = this;
        function anim() {

            var scrollTo = IdRow * elmRow.innerHeight();

            elm.animate({ scrollTop: scrollTo }, 650);
        }

        anim();
    }
    //endregion


    // #region AUTOREFRESH
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
                this.$log.debug('Inactividad por 60000 millisegundos, ACTUALIZO RECEPCION!');
                // actualizo recepcion, pero que sucede si actualizo y todavia no hay 
                // refresco datos => busco profesional de nuevo
                this.refrescar();
            }, 60000);
        });
    }



    // #endregion

}