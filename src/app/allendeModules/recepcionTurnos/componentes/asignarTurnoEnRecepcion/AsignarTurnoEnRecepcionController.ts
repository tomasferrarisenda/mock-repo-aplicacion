/**
* @author:         Javier Delmastro
* @description:    Controller para:
*                        asignar sobreturnos DNP en la recepción
*                        asignar un turno que estaba libre desde la recepción (turno o sobreturno definido por plantilla)
* @type:           Controller
**/
import * as angular from 'angular';
import ServiciosGestionDataService, { IServiciosGestionDataService } from '../../../basicos/servicios/gestion/services/ServiciosGestionDataService';
import { IRecursosDataService } from '../../../basicos/recursos/gestion/services/RecursosDataService';
import { ITiposDeTurnosDataService } from '../../../turnos/common/services/tiposDeTurnos/TiposDeTurnosDataService';
import { IPrestacionGestionDataService } from '../../../basicos/prestaciones/gestion/services/PrestacionGestionDataService';
import TurnoDataService from '../../../turnos/common/services/TurnoDataService'
import { ISobreTurnoDnpDTO } from '../../../turnos';
import ItemsDePlantillaTurnoDataService, { IItemsDePlantillaTurnoDataService } from '../../../turnos/common/services/itemsDePlantillaTurno/ItemsDePlantillaTurnoDataService'
import { IRecepcionTurnosStorageHelperService, IRecepcionTurnosLogicService } from '../../../recepcionTurnos';
import { IDisponibilidadDeTurnosDataService } from '../../../turnos/common/services/DisponibilidadDeTurnosDataService';
import { IRecepcionTurnosDataService } from '../../services/RecepcionTurnosDataService';

export class AsignarTurnoEnRecepcionController implements angular.IController {
    // ID
    static $inject = ['Logger', '$state', '$stateParams', '$scope', '$q', '$timeout', "uiCalendarConfig", 'moment', 'StateHelperService', 'AlertaService', 'ModalService',
        'DateUtils', 'AsignacionTurnoLogicService',
        'ServiciosGestionDataService', 'RecursosDataService', 'PlantillaDataService', 'TiposDeTurnosDataService', 'RecepcionTurnosLogicService',
        'PrestacionGestionDataService', 'TurnoDataService', 'ItemsDePlantillaTurnoDataService', 'RecepcionTurnosStorageHelperService', 'DisponibilidadDeTurnosDataService',
        'RecepcionTurnosDataService', 'AsignacionTurnoDataService', 'AsignacionTurnoModalService', 'SucursalDataService', 'MantenimientoAgendaDataService'];


    /* ---------------------------------------------  VARIABLES -------------------------------------------- */
    //region VARIABLES
    pacienteSeleccionado: any;
    mostrarSelectorDeHora: boolean = true;
    loading: boolean = false;
    sobreTurno: any;
    horaTurno: any;
    stateTipoDeAsignacionDeTurnos: string = '';
    itemDePlantilla: any;

    controlEdad: boolean = true;

    puedeAsignarTurno: boolean = true;
    puedeAsignarTurnoMutual: boolean = true;
    deshabilitarCambioDia: boolean = false;

    bloquesTurnos: Array<any> = [];
    tiposDeTurnos: any;

    grupoPrestacionIds: string = '';

    observacionesDelTurno;
    observacionesPlantilla;

    data = {
        fechaTurno: Date,
        //horaTurno: any,
        servicio: {
            Id: 0,
            Nombre: ''
        },
        recurso: {
            Id: 0,
            IdTipoRecurso: 0,
            Nombre: ''
        },
        sucursal: {
            Id: 0,
            Nombre: ''
        },
        //tiposDeTurnos: {},
        tipoDeTurnoSeleccionado: {
            Id: 0,
            Nombre: ''
        },
        idItemDePlantilla: 0,
        idPlantillaTurno: 0,

        observaciones: '',
        dtoParaAsignarDNP: '',
        precioParticularMutualTurno: {
            FechaConvenioFinanciadorDesde: null,
            FechaConvenioFinanciadorHasta: null,
            FechaConvenioParticularDesde: null,
            FechaConvenioParticularHasta: null,
            ImporteTotalCoseguro: null,
            ImporteTotalParticular: null
        }

    };

    prestaciones: any;
    prestacionesObtenidas;

    title = {
        name: 'Asignar sobreturno DNP',
        icon: 'LIST'
    };

    // variable para activar/desactivar el asignar
    asignarActivado: boolean = true;

    //para mostrar feriados o recesos
    existenFeriados: any;
    existenRecesos: any;

    // Constructor
    constructor(

        private $log: ILogger,
        private $state,
        private $stateParams,
        private scope,
        private $q,
        private $timeout,
        private uiCalendarConfig,
        private moment,
        private StateHelperService,
        private AlertaService,
        private ModalService: IModalService,
        private DateUtils: IDateUtils,
        private AsignacionTurnoLogicService,
        private ServiciosGestionDataService: IServiciosGestionDataService,
        private RecursosDataService: IRecursosDataService,
        private PlantillaDataService,
        private TiposDeTurnosDataService: ITiposDeTurnosDataService,
        private RecepcionTurnosLogicService: IRecepcionTurnosLogicService,
        private PrestacionGestionDataService: IPrestacionGestionDataService,
        private TurnoDataService,
        private ItemsDePlantillaTurnoDataService: IItemsDePlantillaTurnoDataService,
        private StorageService: IRecepcionTurnosStorageHelperService,
        private DisponibilidadDeTurnosDataService: IDisponibilidadDeTurnosDataService,
        private RecepcionTurnosDataService: IRecepcionTurnosDataService,
        private AsignacionTurnoDataService,
        private AsignacionTurnoModalService,
        private SucursalDataService,
        private MantenimientoAgendaDataService
    ) { }

    //endregion

    /* ---------------------------------------------- ACTIVATE --------------------------------------------- */
    //region ACTIVATE

    $onInit() {
        this.$log = this.$log.getInstance('AsignarTurnoEnRecepcionController');
        this.$log.debug("INIT");
        this.inicializarWatchs();

        // Este componente se usa para dos fines:
        //  - Asignar sobreturnos DNP (el turno no existe previamente). STATE: recepcionturnos.asignarSobreturnoDNP
        //  - Asignar turnos/sobreturnos que están definidos por plantillas. STATE: recepcionturnos.asignar

        //////puedo venir de dos states diferentes
        //consulto si tengo algo en el storage => vengo de un state "adelantado"
        if (this.StorageService.existStoredObjects(this.storageKeys.keyRecepcion)) {
            //existen datos, vengo de un state, donde tengo que cargar los datos ya guardados
            this.getStoredData();
            this.cleanStorage();

        } else {
            //no existen datos, cargo comun con state params
            // Recibo los parámetros comunes a ambos states
            this.data.fechaTurno = this.DateUtils.getDateFromMoment(this.$stateParams.fecha);
            this.data.servicio = this.$stateParams.servicio;
            this.data.recurso = this.$stateParams.recurso;
            if (this.$stateParams.sucursal)
                this.data.sucursal = this.$stateParams.sucursal;
            else {
                if (this.$stateParams.bloquesTurnos) {
                    //tengo bloques de turnos => analizo cuantos
                    if (this.$stateParams.bloquesTurnos.length > 1) {
                        //tengo varios bloques de turnos con sucursales
                        this.deshabilitarCambioDia = true;
                        this.bloquesTurnos = angular.copy(this.$stateParams.bloquesTurnos);
                        this.$log.debug('bloqueTurnosObtenidos..', this.bloquesTurnos);
                        // var _date = new Date();
                        // this.horaTurno = new Date();
                        // this.horaTurno.hora = _date.getHours();
                        // this.horaTurno.minuto = _date.getMinutes();
                        this.horaTurno = angular.copy(this.moment(this.$stateParams.bloquesTurnos[0].HoraDesde, 'HH:mm').toDate());
                        this.data.sucursal = this.RecepcionTurnosLogicService.obtenerSucursalDeBloqueTurnosConHora(this.$stateParams.bloquesTurnos, this.horaTurno);
                        if (this.data.sucursal.Id == 0) {
                            this.AlertaService.NewError("No hay bloques disponibles para el horario seleccionado, cambie horario de turno");
                            this.puedeAsignarTurno = false;
                        }
                    } else if (this.$stateParams.bloquesTurnos.length === 1) {
                        //tengo una sola sucursal => por lo tanto la asigno y controlo cuando voy a asignar el turno
                        this.data.sucursal = angular.copy(this.$stateParams.bloquesTurnos[0].Sucursal);
                        this.bloquesTurnos = angular.copy(this.$stateParams.bloquesTurnos);
                        this.deshabilitarCambioDia = true;
                        //seteo la primer hora del primer turno de la lista

                        this.horaTurno = angular.copy(this.moment(this.$stateParams.bloquesTurnos[0].HoraDesde, 'HH:mm').toDate());
                    }

                }
            }

            if (this.$stateParams.paciente) {
                this.pacienteSeleccionado = angular.copy(this.$stateParams.paciente);
            }

            this.stateTipoDeAsignacionDeTurnos = this.$state.current.name;

            this.$log.debug("DNP $stateParams: ", this.$stateParams);

            //voy a guardar los datos obtenidos por las dudas vayamos a otro state
            this.setStoredData();
        }

        let _fecha = this.moment(this.data.fechaTurno).format("MM-DD-YYYY");
        var _tiposDeTurnos = this.TiposDeTurnosDataService.obtenerTodos();
        var _obtenerObservacionesPlantilla = this.PlantillaDataService.obtenerPlantillasConObservacionesPorServicioRecurso(
            this.data.servicio.Id,
            this.data.recurso.IdTipoRecurso,
            this.data.recurso.Id,
            _fecha,
            _fecha);
        var _sucursales = this.SucursalDataService.getAllSucursalesConFiltro();

        // Si estor por dar un DNP:
        if (this.$state.current.name === 'recepcionturnos.asignarSobreturnoDNP') {

            if (!this.$stateParams.bloquesTurnos) {

                var _date = new Date();
                this.horaTurno = new Date();
                this.horaTurno.hora = _date.getHours();
                this.horaTurno.minuto = _date.getMinutes();
            }
            this.mostrarSelectorDeHora = true;

            var _prestaciones = this.PrestacionGestionDataService.obtenerPorRecursoServicioSucursal(this.data.recurso.IdTipoRecurso,
                this.data.recurso.Id, this.data.servicio.Id, this.data.sucursal.Id);
            //var _dtoParaAsignarDNP = this.TurnoDataService.obtenerNuevoSobreturnoDnpDto();

            this.$q.all([
                _tiposDeTurnos,
                _prestaciones,
                _obtenerObservacionesPlantilla,
                _sucursales
                //_dtoParaAsignarDNP
            ]).then((pResults) => {
                this.$log.debug('obteniendo resultados onInit', pResults);
                this.tiposDeTurnos = this.AsignacionTurnoLogicService.obtenerTiposDeTurnoFiltrado(pResults[0]);
                this.prestaciones = pResults[1];
                this.prestacionesObtenidas = angular.copy(pResults[1]);
                //this.data.dtoParaAsignarDNP = pResults[2];

                // obtengo las observaciones
                this.setearObservacionesParaRecurso(pResults[2][0], pResults[3]);
                this.loading = false;

                //voy a consultar si tengo feriados o excepciones para el turno 
                this.checkExcepcionesOFeriados();

            }, (pError) => {
                this.$log.error('Error onInit', pError);
                this.loading = false;
            });

        } else if (this.$state.current.name === 'recepcionturnos.asignar' || this.$state.current.name === 'consultorioMedico.asignar') {
            // obtener la hora del parametro
            // this.horaTurno = angular.copy(this.moment(this.$stateParams.hora || this.horaTurno, 'HH:mm').toDate());
            this.mostrarSelectorDeHora = false;
            this.horaTurno = this.$stateParams.hora || this.horaTurno;

            // obtener el item del parametro
            if (this.data.idItemDePlantilla == 0)
                this.data.idItemDePlantilla = this.$stateParams.idItemDePlantilla;

            // Conseguir el Item de Plantilla del backend
            var _itemDePlantilla = this.ItemsDePlantillaTurnoDataService.obtenerPorId(this.data.idItemDePlantilla);

            // Para ver luego de obtener el Item
            //      - los tipos de turnos asignables en base al item de plantilla
            //      - las prestaciones asignables en base al item de plantilla

            this.$q.all([
                _tiposDeTurnos,
                _itemDePlantilla,
                _obtenerObservacionesPlantilla,
                _sucursales
                //_dtoParaAsignarDNP
            ]).then((pResults) => {

                this.$log.debug('obteniendo resultados onInit', pResults);
                this.tiposDeTurnos = pResults[0];
                this.itemDePlantilla = pResults[1];
                this.data.idPlantillaTurno = this.itemDePlantilla.IdPlantillaTurno;

                // obtengo las observaciones
                this.setearObservacionesParaRecurso(pResults[2][0], pResults[3]);
                //      - los tipos de turnos asignables en base al item de plantilla
                //      - las prestaciones asignables en base al item de plantilla
                this.configurarTiposTurnosMasPrestaciones();
                this.loading = false;

                //voy a consultar si tengo feriados o excepciones para el turno 
                this.checkExcepcionesOFeriados();

            }, (pError) => {
                this.$log.error('Error onInit', pError);
                this.loading = false;
            });

        }
    }

    volver() {
        this.cleanStorage();
        this.$state.go('recepcionturnos.recepcion');
        //this.StateHelperService.goToPrevState();

    }

    //endregion

    /* ---------------------------------------------- CONTROLES --------------------------------------------- */
    //region CONTROLES
    controlSexoEdad() {

        if (this.$state.current.name !== 'recepcionturnos.asignarSobreturnoDNP') {

            this.$log.debug('control sexo/edad activado..', this.data.idItemDePlantilla, this.pacienteSeleccionado);
            this.puedeAsignarTurno = true;
            if (this.pacienteSeleccionado) {

                if (this.controlEdad) {
                    //tengo el control de edad -> valido con sexo y edad
                    this.TurnoDataService.validarFiltrosDeEdadSexo(this.data.idItemDePlantilla, this.pacienteSeleccionado.Id)
                        .then(pResponse => {
                            this.$log.debug('validarFiltroEdadSexoOk', pResponse);
                            if (!pResponse.IsOk) {
                                this.AlertaService.NewWarning("Atencion", pResponse.Message);
                                this.puedeAsignarTurno = false;
                            }
                        }, pError => {
                            this.$log.error('validarFiltroEdadSexoError', pError);
                        });

                }
                else { //valido solamente para el sexo, ya que no tengo control edad
                    this.TurnoDataService.validarFiltrosDeSexo(this.data.idItemDePlantilla, this.pacienteSeleccionado.Id)
                        .then(pResponse => {
                            this.$log.debug('validarFiltrosDeSexoOk', pResponse);
                            if (!pResponse.IsOk) {
                                this.AlertaService.NewWarning("Atencion", pResponse.Message);
                                this.puedeAsignarTurno = false;
                            }
                        }, pError => {
                            this.$log.error('validarFiltrosDeSexoError', pError);
                        });
                }

            }
        }
    }

    configurarTiposTurnosMasPrestaciones() {
        this.loading = true;
        // En funcion de lo definido en el Item de Plantilla configuro los combos de Tipos de Turnos y Prestaciones

        var _tiposDeTurnos: any = [];
        if (this.itemDePlantilla.IdTipoTurno === 3) {
            // Si es 3 = INDISTINTO -> Dejo 1V y UC

            _tiposDeTurnos.push(this.tiposDeTurnos.find(x => x.Id === 1));
            _tiposDeTurnos.push(this.tiposDeTurnos.find(x => x.Id === 2));

        } else if (this.itemDePlantilla.IdTipoTurno === 6) {
            // Si es 6 = INDISTINTO CON PRACTICAS -> Dejo 1V, UC, Practicas
            _tiposDeTurnos.push(this.tiposDeTurnos.find(x => x.Id === 1));
            _tiposDeTurnos.push(this.tiposDeTurnos.find(x => x.Id === 2));
            _tiposDeTurnos.push(this.tiposDeTurnos.find(x => x.Id === 5));

        } else {
            // De lo contrario solo dejo el tipo indicado
            _tiposDeTurnos.push(this.tiposDeTurnos.find(x => x.Id === this.itemDePlantilla.IdTipoTurno));

        }

        this.tiposDeTurnos = angular.copy(_tiposDeTurnos);

        // Prestaciones

        if (this.itemDePlantilla.IdPrestacionesDefinidas === 4) {
            // Si son solo las definidas, dejo las que vinieron en el item
            this.prestaciones = this.itemDePlantilla.PrestacionesMedicas;
            this.prestacionesObtenidas = angular.copy(this.itemDePlantilla.PrestacionesMedicas);


            angular.forEach(this.prestaciones, function (prestacion) {
                prestacion.Id = prestacion.IdPrestacion;
                prestacion.Nombre = prestacion.Prestacion;
            });

            this.prestacionesObtenidas = angular.copy(this.prestaciones);


        } else if (this.itemDePlantilla.IdPrestacionesDefinidas === 1) { //TODAS LAS DEL SERVICIO
            //cargo todas las del servicio y sucursal
            this.loading = true;
            this.PrestacionGestionDataService.obtenerPorServicioEnSucursal(this.data.sucursal.Id, this.data.servicio.Id)
                .then((pResults) => {
                    this.$log.debug("Prestaciones obtenerPorServicioEnSucursal:: ", pResults)
                    this.prestaciones = pResults;
                    this.prestacionesObtenidas = angular.copy(pResults);
                    this.loading = false;
                },
                    (pError) => {
                        this.$log.error('error cargar las pretaciones', pError);
                        this.loading = false;
                    });

        } else if (this.itemDePlantilla.IdPrestacionesDefinidas === 2) { // TODAS LAS DE LA ESPECIALIDAD
            //POR AHORA NO LO IMPLEMENTAMOS
        }
        else if (this.itemDePlantilla.IdPrestacionesDefinidas === 3) { // TODAS LAS DEL RECURSO
            this.loading = true;
            this.PrestacionGestionDataService.obtenerPorRecursoServicioSucursal(this.data.recurso.IdTipoRecurso, this.data.recurso.Id, this.data.servicio.Id, this.data.sucursal.Id)
                .then((pResults) => {
                    this.$log.debug("Prestaciones obtenerPorRecursoServicioSucursal:: ", pResults)
                    this.prestaciones = pResults;
                    this.prestacionesObtenidas = angular.copy(pResults);
                    this.loading = false;
                },
                    (pError) => {
                        this.$log.error('error cargar las pretaciones', pError);
                        this.loading = false;
                    });

        }

        // CODIGO RODRIGO BASSI
        else if (this.itemDePlantilla.IdPrestacionesDefinidas === 5) { // GRUPO DE PRESTACIONES
            this.loading = true;
            // RECORRER this.itemDePlantilla.GruposDePrestaciones Y CONCATENAR LOS Id SEPARADOS POR COMA
            this.itemDePlantilla.GruposDePrestaciones.forEach(valores => {
                if (this.grupoPrestacionIds === '') {
                    this.grupoPrestacionIds = String(valores.IdGrupoDePrestaciones);
                } else {
                    this.grupoPrestacionIds = this.grupoPrestacionIds + ',' + String(valores.IdGrupoDePrestaciones);
                }
            });
            // this.grupoPrestacionIds TENGO LOS ID SEPARADOS POR COMA EJ: 27,28,29

            this.$log.debug("this.grupoPrestacionIds-->", this.grupoPrestacionIds);
            // LLAMO AL BACK Y ENVIO UN STRING CON LOS ID SEPARADOS POR COMA
            this.RecepcionTurnosDataService.ObtenerPorGruposDePrestaciones((this.grupoPrestacionIds).trim()).then((pResults) => {
                // GUARDO LA RESPUESTA DE BACK Y MUESTRO EN PANTALLA
                this.prestaciones = pResults;
                this.prestacionesObtenidas = angular.copy(pResults);
                this.$log.debug("ObtenerPorGruposDePrestaciones-->", pResults);
            },
                (pError) => {
                    this.$log.error('error cargar Grupos de Prestaciones', pError);
                    // this.loading = false;
                });


        }

        this.loading = false;

    }


    setearObservacionesParaRecurso(observacionesPlantilla, sucursales) {

        if (observacionesPlantilla && observacionesPlantilla.Observaciones)
            this.observacionesPlantilla = this.AsignacionTurnoLogicService.getObservacionesPorSucursalParseadas(observacionesPlantilla.Observaciones,
                sucursales);
    }
    //endregion 

    /* --------------------------------------------- ASIGNACION -------------------------------------------- */
    //region ASIGNACION
    asignar() {
        this.$log.debug("Asignar - init");
        this.loading = true;
        // 1. Valido que todos los datos requeridos estén cargados

        // 1.1 Controlar si falta seleccionar el paciente

        if (!this.pacienteSeleccionado) {
            this.AlertaService.NewWarning("Atención", "Debe seleccionar el paciente");
            this.loading = false;
            return;
        }

        // 1.2 Controlar si la fecha está vacía
        if (!this.data.fechaTurno) {
            this.AlertaService.NewWarning("Atención", "Debe seleccionar la Fecha del turno");
            this.loading = false;
            return;
        }

        // 1.3 Controlar si falta seleccionar el tipo de turno
        if (this.data.tipoDeTurnoSeleccionado.Id === 0) {
            this.AlertaService.NewWarning("Atención", "Debe seleccionar el Tipo de turno");
            this.loading = false;
            return;
        }

        // 1.4 Controlar si falta seleccionar la prestación
        var prestacionesSeleccionadas: number[] = [];

        angular.forEach(this.prestaciones, function (prestacion) {
            if (prestacion.status === true) {

                var idPrestacion = 0;

                // Controlo si las prestaciones tienen Id o IdPrestación, ya que cambia dependiendo de lo definido en el item de Plantilla
                if (prestacion.IdPrestacion !== undefined) {
                    idPrestacion = angular.copy(prestacion.IdPrestacion);
                } else {
                    idPrestacion = angular.copy(prestacion.Id);
                }

                prestacionesSeleccionadas.push(idPrestacion);
            }
        });

        if (prestacionesSeleccionadas.length === 0) {
            this.AlertaService.NewWarning("Atención", "Debe seleccionar alguna prestación");
            this.loading = false;
            return;
        }

        if (this.asignarActivado) {
            if (this.$state.current.name === 'recepcionturnos.asignarSobreturnoDNP') {
                this.asignarDNP(prestacionesSeleccionadas);
            } else if (this.$state.current.name === 'recepcionturnos.asignar' || this.$state.current.name === 'consultorioMedico.asignar') {
                this.asignarEsteTurno(prestacionesSeleccionadas);
            }
        }
    }

    asignarDNP(prestacionesSeleccionadas) {
        this.loading = true;

        // Preparo el DTO para asignar el sobreturno DNP    
        var dto = {
            DuracionIndividual: 0,
            DuracionTotal: 0,
            Fecha: angular.copy(this.moment(this.data.fechaTurno).format("MM-DD-YYYY")),
            HoraEnMinutos: 0,
            IdEstadoTurno: 0,
            IdMutual: 0,
            IdPaciente: 0,
            IdPlanMutual: 0,
            IdPlantillaTurno: 0,
            IdRecurso: 0,
            IdServicio: 0,
            IdSucursal: 0,
            IdTipoRecurso: 0,
            IdTipoTurno: 0,
            Observaciones: '',
            Prestaciones: prestacionesSeleccionadas
        };

        dto.DuracionIndividual = 15;
        dto.DuracionTotal = 15;
        dto.Fecha = angular.copy(this.moment(this.data.fechaTurno).format("MM-DD-YYYY"));

        var horas = this.horaTurno.getHours();
        var minutos = this.horaTurno.getMinutes();
        dto.HoraEnMinutos = horas * 60 + minutos;

        dto.IdEstadoTurno = 1;

        dto.IdPaciente = this.pacienteSeleccionado.Id;
        dto.IdMutual = this.obtenerIdMutual();
        dto.IdPlanMutual = this.obtenerIdPlanMutual();

        dto.IdPlantillaTurno = 0;

        dto.IdRecurso = this.data.recurso.Id;
        dto.IdTipoRecurso = this.data.recurso.IdTipoRecurso;
        dto.IdServicio = this.data.servicio.Id;
        dto.IdSucursal = this.data.sucursal.Id;
        dto.Observaciones = this.data.observaciones;
        dto.IdTipoTurno = this.obtenerIdTipoTurno();

        this.$log.debug("Asignar (DTO):", dto);

        this.TurnoDataService.validarAsignarSobreTurnoDNP(dto)
            .then(pResults => {

                if (pResults.IsOk === true) {

                    this.TurnoDataService.asignarSobreTurnoDNP(dto).then(
                        (pResults) => {
                            this.$log.debug('Asignar OK', pResults);

                            this.AlertaService.NewSuccess("Atención", "Sobreturno registrado con éxito");
                            this.loading = false;
                            this.cleanStorage();
                            this.StateHelperService.goToPrevState();
                        },
                        (pError) => {
                            this.$log.error('Error onInit', pError);
                            this.loading = false;
                        });

                } else {
                    this.loading = false;
                    if (pResults.Message != null)
                        this.AlertaService.NewError("Error", pResults.Message);
                    else
                        this.AlertaService.NewError("Error", "Error de servidor");
                }

            }, pError => {
                this.loading = false;
                this.$log.error('validarAsignarSobreTurnoDNPERROR', pError);
            })



    }

    asignarEsteTurno(prestacionesSeleccionadas) {
        this.loading = true;

        // Preparo el DTO para asignar el sobreturno DNP    
        var turnoAsignableDTO = {
            Fecha: angular.copy(this.moment(this.data.fechaTurno).format("MM-DD-YYYY")),
            Hora: this.horaTurno,
            DuracionIndividual: 15,
            IdSucursal: this.data.sucursal.Id,
            IdPlantillaTurno: this.data.idPlantillaTurno,
            IdItemDePlantilla: this.data.idItemDePlantilla,
        };

        var criterioBusquedaDTO = {
            Id: 0,
            IdSucursal: this.data.sucursal.Id,
            IdServicio: this.data.servicio.Id,
            IdTipoRecurso: this.data.recurso.IdTipoRecurso,
            IdRecurso: this.data.recurso.Id,
            IdPaciente: 0,
            IdTipoDeTurno: 0,
            IdTipoBusqueda: 0,
            Prestaciones: prestacionesSeleccionadas,
            EdadPaciente: 0,
            SexoPaciente: '',
            IdFinanciador: 0,
            IdPlan: 0,
            IdSistemaCliente: 3, // Sistema = Recepción
            FechaDesde: turnoAsignableDTO.Fecha,
            FechaHasta: turnoAsignableDTO.Fecha,
            ControlarEdad: this.controlEdad
        };


        criterioBusquedaDTO.IdPaciente = this.pacienteSeleccionado.Id;
        criterioBusquedaDTO.IdFinanciador = this.obtenerIdMutual();
        criterioBusquedaDTO.IdPlan = this.obtenerIdPlanMutual();

        criterioBusquedaDTO.IdTipoDeTurno = this.obtenerIdTipoTurno()
        criterioBusquedaDTO.IdTipoBusqueda = this.obtenerIdTipoBusqueda();

        criterioBusquedaDTO.EdadPaciente = this.pacienteSeleccionado.Edad;
        criterioBusquedaDTO.SexoPaciente = this.obtenerSexoPaciente();


        /**
        * IMPLEMENTACION DE REGLAS DE DURACION PARA TURNOS
        * Ya tenemos el criterio d ebusqueda y el turno
        * Debemos implementar logica para consultar si hace falta un turno extra
        * Y si efectivamente dentro de this.data.listaTurnos existe un turno para extra
        * Ademas debemos mostrar cartel avisando que tomaremos dos turnos para asignar
        * 
        */
        let _turnosAsignar;

        // vamos a obtener la lista de turnos asignables para ese dia
        this.DisponibilidadDeTurnosDataService.obtenerTurnosDisponiblesConReglasExplicadas(criterioBusquedaDTO)
            .then((disponibilidadResult) => {

                this.$log.debug('disponibilidadResult', disponibilidadResult);


                // consulto si la disponibilidad tengo situaciones por dia
                if (disponibilidadResult.SituacionesPorDia && disponibilidadResult.SituacionesPorDia.length == 0) {
                    // no tengo disponibilidad para asignar el turno por regla
                    this.asignarTurnoSimple(turnoAsignableDTO, criterioBusquedaDTO);
                } else {

                    // tengo disponibilidad por regla
                    if (disponibilidadResult.SituacionesPorDia[0] && disponibilidadResult.SituacionesPorDia[0].TurnosAsignables) {

                        disponibilidadResult.SituacionesPorDia[0].TurnosAsignables.forEach((turno, key) => {
                            turno.Duracion = angular.copy(turno.DuracionIndividual);
                            turno.IdRow = key;
                        });
                    }

                    // tengo situaciones por dia pero tengo que consultar si tengo turnos asignables
                    if (disponibilidadResult.SituacionesPorDia[0].TurnosAsignables && disponibilidadResult.SituacionesPorDia[0].TurnosAsignables.length) {

                        let listaTurnos = angular.copy(disponibilidadResult.SituacionesPorDia[0].TurnosAsignables);

                        this.obtenerDuracionNecesaria(criterioBusquedaDTO, listaTurnos)
                            .then((pResult) => {
                                this.$log.debug('pResult', pResult);
                                if (pResult === true) {
                                    // obtuve todas las duraciones del turno y les setee la duracion individual/conjunta
                                    // ahora vemos si necesitamos algun turno mas para la duracion

                                    // primero busco el turno que quiero asignar dentro de la lista obtenida desde recepcion
                                    // tngo que tener en cuenta todas las variables posibles de ese tipo turno (tipo turno, etc)
                                    // ademas de limpiar los turnos solamente libresl

                                    var _turnoCandidato = listaTurnos.find(x => x.Hora === turnoAsignableDTO.Hora);

                                    // consulto si la duracion individual hace falta para obtener mas turnos
                                    if (_turnoCandidato.DuracionIndividualRegla !== 0) {
                                        // necesito obtener la lista con duracion
                                        var _responseObtenerTurnos = this.RecepcionTurnosLogicService.obtenerTurnosParaAsignarConReglaDuracionDesdeLista(listaTurnos, _turnoCandidato);
                                        if (_responseObtenerTurnos.estadORet) {

                                            _turnosAsignar = _responseObtenerTurnos.lista;
                                            // si tenemos mas de un turno, entonces necesitamos asignar varios turnos
                                            this.$log.debug('cantidad de turnos obtenidos', _turnosAsignar);
                                            // consultamos si tenemos un turno (_turnoAsignar.length = 0) => Asignamos el turno comun
                                            if (_turnosAsignar.length <= 1) {
                                                this.asignarTurnoSimple(_turnoCandidato, criterioBusquedaDTO);
                                            } else if (_turnosAsignar.length > 1) {
                                                // sino (_turnoAsignar.length > 0) asignamos para multiple
                                                // mostramos modal explicando que hace falta maas turnos para asignar y si quiere continuar
                                                let _turnoMultiple: any = {};
                                                _turnoMultiple.TurnosElegidosDto = angular.copy(_turnosAsignar);
                                                _turnoMultiple.CriterioBusquedaDto = angular.copy(criterioBusquedaDTO);
                                                _turnoMultiple.Observaciones = angular.copy(this.data.observaciones);
                                                _turnoMultiple.Duracion = angular.copy(_turnosAsignar[0].DuracionIndividualRegla);
                                                this.showConfirmarAsignarTurnoMultiple(_turnoMultiple);
                                            }
                                        }
                                    } else {
                                        this.asignarTurnoSimple(_turnoCandidato, criterioBusquedaDTO);
                                    }

                                }
                            }, (pError) => {
                                this.loading = false;
                                this.$log.error('pError', pError);
                            });
                    } else //no tengo turnos disponibles por lo que tendria que mostrar cartel con regla de porque no tengo el turno disponible
                    {
                        //trngo reglas que no permiten visualizar los turnos disponibles en asignacion
                        this.loading = false;
                        this.$log.debug('response ObtenerReglaPorIdOk', disponibilidadResult);
                        if (!angular.isUndefined(disponibilidadResult.SituacionesPorDia[0].Reglas[0])) {

                            // Object.keys(response.SituacionesPorDia[0].Reglas).map(e => {
                            //     console.log(`key= ${e} value = ${response.SituacionesPorDia[0].Reglas[e]}`)
                            // })

                            this.PlantillaDataService.obtenerReglaPorId(disponibilidadResult.SituacionesPorDia[0].Reglas[0].Regla)
                                .then(pResponse => {
                                    this.$log.debug('pResponse ObtenerReglaPorIdOk', pResponse);
                                    if (pResponse) {
                                        if (pResponse.Descripcion) this.AlertaService.NewWarning("No se puede otorgar el turno", pResponse.Descripcion);
                                    }
                                }, error => {
                                    this.$log.error('error ObtenerReglaPorIdError', error);
                                });
                        }

                    }


                }

            }, (pError) => {
                this.loading = false;
                this.$log.error('pError', pError);
            });

    }


    asignarTurnoSimple(turno, criterio) {

        var AsignarTurnoSimpleDTO = {
            TurnoElegidoDto: turno,
            CriterioBusquedaDTO: criterio,
            Observaciones: this.data.observaciones
        };

        this.TurnoDataService.validarAsignarTurnoDesdeRecepcion(AsignarTurnoSimpleDTO)
            .then((pResponse) => {

                if (pResponse.IsOk === true) {
                    this.TurnoDataService.asignarTurno(AsignarTurnoSimpleDTO)
                        .then((pResults) => {
                            this.$log.debug('Asignar OK', pResults);
                            this.AlertaService.NewSuccess("Atención", "Turno asignado con éxito");
                            this.loading = false;
                            this.cleanStorage();
                            this.StateHelperService.goToPrevState();
                        },
                            (pError) => {
                                this.$log.error('Error onInit', pError);
                                this.loading = false;
                            });
                } else {
                    this.loading = false;
                    if (pResponse.Message != null)
                        this.AlertaService.NewError("Error", pResponse.Message);
                    else
                        this.AlertaService.NewError("Error", "Error de servidor");
                }
            }, (pError) => {
                this.loading = false;
                this.$log.error('Error validar', pError);
            });
    }

    showConfirmarAsignarTurnoMultiple(turnosMultiples) {

        var optionsObj = {
            ok: 'Si',
            cancel: 'No'
        };

        this.ModalService.confirm("Atención, para asignar este turno, se necesitan turnos extras. Desea continuar?",
            (_pOk) => {
                if (_pOk) {
                    this.asignarTurnoMultiple(turnosMultiples);
                };
            }, "", optionsObj);
    }


    asignarTurnoMultiple(_turnosMultiple) {
        this.$log.debug('Voy a asignar turnos multiples', _turnosMultiple);

        this.TurnoDataService.validarAsignarTurnosMultiples(_turnosMultiple)
            .then((pResultValidar) => {
                this.$log.error('pResultValidar', pResultValidar);
                if (pResultValidar.IsOk === true) {

                    this.TurnoDataService.asignarTurnosMultiple(_turnosMultiple)
                        .then((pResult) => {
                            // vm.formControl.loading = false;
                            this.$log.debug('asignarTurno Ok', pResult);
                            this.AlertaService.NewSuccess("Operacion Exitosa", "El turno ha sido otorgado correctamente");
                            this.volver();
                        }, (pError) => {
                            // vm.formControl.loading = false;
                            this.$log.error('Error asignar turno', pError);
                        });

                } else {
                    // vm.formControl.loading = false;
                    this.loading = false;
                    this.$log.error('validate ', pResultValidar.IsOk);
                    this.AlertaService.NewError("Error", pResultValidar.Message);
                }
            }, (pValidarError) => {
                this.loading = false;
                this.$log.error('pValidarError', pValidarError);
                // vm.formControl.loading = false;
            });

    }
    //endregion

    /* ---------------------------------------------- SUPPORT ---------------------------------------------- */
    //region SUPPORT

    abrirRequerimientos() {

        // Abre el popup de Requerimientos (administrativos) y Preparaciones (médicas) de las prestaciones para las que se quiere dar el turno
        var turnos: Array<any> = [];
        var dataTurnoRequerimiento;
        // Controllo si ya se seleccionó el paciente y luego las prestaciones
        var pacienteId = (this.pacienteSeleccionado) ? this.pacienteSeleccionado.Id : 0;

        if (pacienteId === 0) {
            // No hay paciente seleccionado, no habrá pestaciones ni criterio de búsqueda
            this.AlertaService.NewWarning("Atención", "Debe seleccionar un paciente");
            return;
        }

        var _prestaciones = this.obtenerPrestacionesSeleccionadas();
        var criterio = this.setearCriterioBusqueda(_prestaciones);

        if (criterio.IdTipoDeTurno === 0) {
            this.AlertaService.NewWarning("Atención", "Debe seleccionar un Tipo de Turno");
            return;
        }

        if (_prestaciones && _prestaciones.length === 0) {
            // no hay prestaciones seleccionadas, no puedo ver los requerimientos
            this.AlertaService.NewWarning("Atención", "Debe seleccionar alguna prestación");
            return;
        }

        //tengo un turno del dia seleccionado, continuo entonces con ese
        turnos.push(this.getTurnoDto());
        this.$log.debug('turnos de requerimientos', turnos);
        if (turnos) {

            dataTurnoRequerimiento = this.getDataTurnoParaOtorgar(turnos);
            this.AsignacionTurnoModalService.openRequerimientosMasPreparaciones(dataTurnoRequerimiento, turnos, criterio);
        }
        else return;

    }

    obtenerPrestacionesSeleccionadas() {

        var prestacionesSeleccionadas: Array<any> = [];
        angular.forEach(this.prestaciones, function (prestacion) {
            if (prestacion.status === true) {
                var idPrestacion = 0;
                // Controlo si las prestaciones tienen Id o IdPrestación, ya que cambia dependiendo de lo definido en el item de Plantilla
                if (prestacion.IdPrestacion !== undefined) {
                    idPrestacion = angular.copy(prestacion.IdPrestacion);
                } else {
                    idPrestacion = angular.copy(prestacion.Id);
                }
                prestacionesSeleccionadas.push(idPrestacion);
            }
        });
        return prestacionesSeleccionadas;
    }

    setearCriterioBusqueda(prestaciones) {

        // Preparo el DTO para asignar el sobreturno DNP    
        var turnoAsignableDTO = {
            Fecha: angular.copy(this.moment(this.data.fechaTurno).format("MM-DD-YYYY")),
            Hora: this.horaTurno,
            DuracionIndividual: 15,
            IdSucursal: this.data.sucursal.Id,
            IdPlantillaTurno: this.data.idPlantillaTurno,
            IdItemDePlantilla: this.data.idItemDePlantilla,
        };

        let criterioBusquedaDTO = {
            Id: 0,
            IdSucursal: this.data.sucursal.Id,
            IdServicio: this.data.servicio.Id,
            IdTipoRecurso: this.data.recurso.IdTipoRecurso,
            IdRecurso: this.data.recurso.Id,
            IdPaciente: 0,
            IdTipoDeTurno: 0,
            IdTipoBusqueda: 0,
            Prestaciones: prestaciones,
            EdadPaciente: 0,
            SexoPaciente: '',
            IdFinanciador: 0,
            IdPlan: 0,
            IdSistemaCliente: 3, // Sistema = Recepción
            FechaDesde: turnoAsignableDTO.Fecha,
            FechaHasta: turnoAsignableDTO.Fecha,
            ControlarEdad: this.controlEdad
        };

        criterioBusquedaDTO.IdPaciente = this.pacienteSeleccionado.Id;
        criterioBusquedaDTO.IdFinanciador = this.obtenerIdMutual();
        criterioBusquedaDTO.IdPlan = this.obtenerIdPlanMutual();

        criterioBusquedaDTO.IdTipoDeTurno = this.obtenerIdTipoTurno()
        criterioBusquedaDTO.IdTipoBusqueda = this.obtenerIdTipoBusqueda();

        criterioBusquedaDTO.EdadPaciente = this.pacienteSeleccionado.Edad;
        criterioBusquedaDTO.SexoPaciente = this.obtenerSexoPaciente();

        return criterioBusquedaDTO;
    }

    getTurnoDto() {

        var hora_minuto;
        if (this.$state.current.name === 'recepcionturnos.asignarSobreturnoDNP') {
            //estoy con DNP debo cambiar la hora
            hora_minuto = angular.copy(this.moment(this.horaTurno).format("HH:MM"))
        } else hora_minuto = this.horaTurno;


        var turnoAsignableDTO = {
            Fecha: angular.copy(this.moment(this.data.fechaTurno).format("MM-DD-YYYY")),
            Hora: hora_minuto,
            DuracionIndividual: 15,
            IdSucursal: this.data.sucursal.Id,
            Sucursal: this.data.sucursal.Nombre,
            IdPlantillaTurno: this.data.idPlantillaTurno,
            IdItemDePlantilla: this.data.idItemDePlantilla,
            Recurso: this.data.recurso.Nombre,
            IdRecurso: this.data.recurso.Id,
            IdTipoRecurso: this.data.recurso.IdTipoRecurso
        };
        return turnoAsignableDTO;
    }

    getDataTurnoParaOtorgar(turno) {

        return this.AsignacionTurnoLogicService.getDataTurnoParaOtorgarLogic(turno, this.prestacionesObtenidas, this.pacienteSeleccionado,
            this.data.servicio);
    }

    obtenerIdMutual() {
        var idMutual = 0;
        angular.forEach(this.pacienteSeleccionado.Afiliaciones, function (financiador) {
            if (financiador.PorDefecto === true) {
                idMutual = angular.copy(financiador.IdMutual);
            }
        });
        return idMutual;
    }

    obtenerIdPlanMutual() {
        var idPlanMutual = 0;
        angular.forEach(this.pacienteSeleccionado.Afiliaciones, function (financiador) {
            if (financiador.PorDefecto === true) {
                idPlanMutual = angular.copy(financiador.IdPlanMutual);
            }
        });
        return idPlanMutual;
    }

    obtenerIdTipoTurno() {
        return this.data.tipoDeTurnoSeleccionado.Id;
    }

    obtenerIdTipoBusqueda() {
        var idTipoBusqueda = 0;

        if (this.itemDePlantilla) { 
         
            if (this.itemDePlantilla.EsSobreTurno) {
                idTipoBusqueda = 2; // Sobreturno
            }
            else {
                idTipoBusqueda = 1; // Turno
            }
        }else idTipoBusqueda = 2;

        return idTipoBusqueda;
    }

    obtenerSexoPaciente() {

        return this.pacienteSeleccionado.NombreTipoSexo.charAt(0);
    }

    loadPrestacionesBtn() {
        var ret = "Prestaciones";
        angular.forEach(this.prestaciones, function (prestacion, key) {
            if (prestacion.status === true) {
                if (key == 0) {
                    ret = "Prestacion: " + prestacion.Nombre;
                } else {
                    ret = ret + "-" + prestacion.Nombre;
                }
            }
        });

        if (ret.length > 45) {
            ret = ret.substring(0, 45);
            ret = ret + "...";
        }
        return ret;
    }

    cambioHoraTurno() {

        if (this.$stateParams.bloquesTurnos) {

            var sucursal = this.RecepcionTurnosLogicService.obtenerSucursalDeBloqueTurnosConHora(this.$stateParams.bloquesTurnos, this.horaTurno);
            if (sucursal.Id !== 0) {
                this.puedeAsignarTurno = true;
                if (sucursal.Id !== this.data.sucursal.Id) {
                    //estoy en una diferente sucursal => cargo estructura de sucursal de nuevo
                    this.data.sucursal = angular.copy(sucursal);
                    var _prestaciones = this.PrestacionGestionDataService.obtenerPorRecursoServicioSucursal(this.data.recurso.IdTipoRecurso,
                        this.data.recurso.Id, this.data.servicio.Id, this.data.sucursal.Id)
                        .then(pResponse => {
                            this.prestaciones = pResponse;
                            this.prestacionesObtenidas = angular.copy(pResponse);
                        }, pError => {
                            this.$log.error('Error obtener prestaciones', pError);
                        })
                }
            } else {
                this.puedeAsignarTurno = false;
                this.AlertaService.NewWarning("Atención!", "No se puede asignar en el horario solicitado");
            }
        }
    }

    showAlertaIsMutualActiva() {
        if (this.pacienteSeleccionado && this.pacienteSeleccionado.Afiliaciones) {
            if (this.pacienteSeleccionado.Afiliaciones.find(x => x.PorDefecto == true).MutualActiva == false) {
                this.AlertaService.NewWarning("Atención", "La mutual seleccionada no esta activa");
                this.puedeAsignarTurnoMutual = false;
            } else if (this.pacienteSeleccionado.Afiliaciones.find(x => x.PorDefecto == true).VisibleEnTurnos == false) {
                this.ModalService.warn("No se pueden otorgar turnos para esta mutual.");
                this.puedeAsignarTurnoMutual = false;
            } else this.puedeAsignarTurnoMutual = true;
        }
    }


    filtrarPrestacionesPorTipoDeTurno() {

        // si es tipo de turno primera vez o ulterior
        if (this.data.tipoDeTurnoSeleccionado) {

            let prestacionesFiltradasPorTipoTurno;
            if (this.data.tipoDeTurnoSeleccionado.Id === 1 || this.data.tipoDeTurnoSeleccionado.Id === 2) {
                prestacionesFiltradasPorTipoTurno = angular.copy(this.prestacionesObtenidas.filter(x => x.IdTipoPrestacion === 1));
            } else if (this.data.tipoDeTurnoSeleccionado.Id === 5) {
                prestacionesFiltradasPorTipoTurno = angular.copy(this.prestacionesObtenidas.filter(x => x.IdTipoPrestacion === 2));
            } else {
                prestacionesFiltradasPorTipoTurno = angular.copy(this.prestacionesObtenidas);
            }

            // if (prestacionesFiltradasPorTipoTurno && prestacionesFiltradasPorTipoTurno.length > 0) {

            //     prestacionesFiltradasPorTipoTurno[0].status = true;
            // } else {
            //     this.AlertaService.NewWarning("No hay prestaciones para el tipo de turno seleccionado");
            // }
            this.prestaciones = angular.copy(prestacionesFiltradasPorTipoTurno);
        }

    }


    checkExcepcionesOFeriados() {
        this.loading = true;

        let _fecha = this.moment(this.data.fechaTurno).format("MM-DD-YYYY");

        let _feriados = this.MantenimientoAgendaDataService.obtenerFeriadoPorFechaContemplandoExcepciones(_fecha,
            this.data.recurso.Id, this.data.recurso.IdTipoRecurso, this.data.servicio.Id, this.data.sucursal.Id);
        let _recesos = this.MantenimientoAgendaDataService.obtenerRecesosAplicadosQueAfectanUnDia(_fecha,
            this.data.recurso.IdTipoRecurso, this.data.recurso.Id, this.data.servicio.Id, this.data.sucursal.Id);

        this.$q.all([
            _feriados,
            _recesos,
        ]).then((pResult) => {
            this.$log.debug('pResult', pResult);
            if (pResult[0]) {
                this.existenFeriados = pResult[0];
            } else if (pResult[1]) {
                this.existenRecesos = pResult[1];
            }
            this.loading = false;
        }, (pError) => {
            this.$log.error('pError', pError);
            this.loading = false;
        });
    }

    checkPrecioParticularMutual() {
        this.$log.debug('Evaluando precio particular/mutual..');
        var dataTurnoRequerimiento;
        var turnos: Array<any> = [];
        if (!this.pacienteSeleccionado) {
            return;
        }

        // 1.2 Controlar si la fecha está vacía
        if (!this.data.fechaTurno) {
            return;
        }

        // 1.3 Controlar si falta seleccionar el tipo de turno
        if (this.data.tipoDeTurnoSeleccionado.Id === 0) {
            return;
        }

        // 1.4 Controlar si falta seleccionar la prestación
        var prestacionesSeleccionadas: number[] = [];

        angular.forEach(this.prestaciones, function (prestacion) {
            if (prestacion.status === true) {

                var idPrestacion = 0;

                // Controlo si las prestaciones tienen Id o IdPrestación, ya que cambia dependiendo de lo definido en el item de Plantilla
                if (prestacion.IdPrestacion !== undefined) {
                    idPrestacion = angular.copy(prestacion.IdPrestacion);
                } else {
                    idPrestacion = angular.copy(prestacion.Id);
                }

                prestacionesSeleccionadas.push(idPrestacion);
            }
        });

        if (prestacionesSeleccionadas.length === 0) {
            return;
        }

        // tengo todos los datos para evaluar convenio particular/mutual;
        var criterio = this.setearCriterioBusqueda(prestacionesSeleccionadas);
        turnos.push(this.getTurnoDto());
        this.$log.debug('turnos de precio mutual/particular', turnos);
        if (turnos) {

            dataTurnoRequerimiento = this.getDataTurnoParaOtorgar(turnos);
            var _turnoAGuardar: any = {};
				//vm.formControl.loading = true;
				_turnoAGuardar.TurnoElegidoDto = angular.copy(turnos[0]);
                _turnoAGuardar.TurnoElegidoDto.DuracionIndividual = angular.copy(turnos[0].Duracion);
            _turnoAGuardar.CriterioBusquedaDto = angular.copy(criterio);
            
            if ( _turnoAGuardar.CriterioBusquedaDto.IdTipoBusqueda == 2) { 
                _turnoAGuardar.TurnoElegidoDto.Hora = this.moment(this.horaTurno).format("HH:mm")
            }

                _turnoAGuardar.CriterioBusquedaDto.IdRecurso = angular.copy(turnos[0].IdRecurso);
                _turnoAGuardar.CriterioBusquedaDto.IdTipoRecurso = angular.copy(turnos[0].IdTipoRecurso);
                _turnoAGuardar.TurnoElegidoDto.Fecha = angular.copy(this.moment(_turnoAGuardar.TurnoElegidoDto.Fecha)
                    .format("MM-DD-YYYY"));

            this.buscarImportesParticularCoseguro(_turnoAGuardar);
        }
        else return;
    }


    buscarImportesParticularCoseguro(_turnoAGuardar) {

        this.$log.debug('BuscarImportesParticular: BUSCANDO...');

        this.TurnoDataService.evaluarImportesTurnoContraConvenio(_turnoAGuardar)
            .then((pResult) => {
                
                if (pResult)
                    this.data.precioParticularMutualTurno = pResult;
                else this.data.precioParticularMutualTurno = {
                    FechaConvenioFinanciadorDesde: null,
                    FechaConvenioFinanciadorHasta: null,
                    FechaConvenioParticularDesde: null,
                    FechaConvenioParticularHasta: null,
                    ImporteTotalCoseguro: null,
                    ImporteTotalParticular: null
                };

                this.$log.debug('evaluarOk var', this.data.precioParticularMutualTurno);
            }, (pError) => {
                this.$log.error("evaluarError", pError);
                this.data.precioParticularMutualTurno = {
                    FechaConvenioFinanciadorDesde: null,
                    FechaConvenioFinanciadorHasta: null,
                    FechaConvenioParticularDesde: null,
                    FechaConvenioParticularHasta: null,
                    ImporteTotalCoseguro: null,
                    ImporteTotalParticular: null
                };
            });

    }
    //endregion

    // #region SUPPORT PARA DURACION DE TURNOS

    obtenerDuracionNecesaria(criterioBusquedaDuracion, listaTurnos) {

        var def = this.$q.defer();
        var _duracionDeTurno = this.AsignacionTurnoDataService.obtenerDuracionNecesariaParaServicio(criterioBusquedaDuracion)
            .then((pResultDuracion) => {
                this.$log.debug('pResult', pResultDuracion);

                if (pResultDuracion) {

                    // TENGO LA DURACION
                    listaTurnos.forEach(turno => {

                        // voy a obtener la regla para el recurso que quiero asignar
                        let _regla = pResultDuracion.find(x => x.IdRecurso === criterioBusquedaDuracion.IdRecurso);
                        if (_regla) {
                            //voy a consultar si tengo varias prestaciones
                            //si tengo 1 o menos seleccionadas asigno duracionIndidual
                            if (criterioBusquedaDuracion.Prestaciones.length <= 1) {
                                turno.DuracionIndividualRegla = angular.copy(_regla.DuracionIndividual);
                                turno.DuracionConjuntaRegla = angular.copy(_regla.DuracionConjunta);

                            } else {
                                //si la cantidad de prestaciones es >  1 
                                //sino asigno la duracion conjunta
                                turno.DuracionIndividualRegla = angular.copy(_regla.DuracionConjunta);
                            }
                            def.resolve(true);
                        } else {
                            def.reject(false);
                        }
                    });

                }

            }, (pError) => {
                this.$log.error('pError', pError);
                def.reject(false);
            });

        return def.promise;
    }

    // #endregion

    /* ---------------------------------------------- STORAGE ---------------------------------------------- */
    //region STORAGE
    storageKeys = {
        keyRecepcion: "asignarturno-recepcion-data"
    }

    getStoredData() {
        var vm = this;

        if (vm.StorageService.existStoredObjects(vm.storageKeys.keyRecepcion)) {
            getData(vm.StorageService.getStorageObj(vm.storageKeys.keyRecepcion));

        }
        function getData(stored) {

            vm.data.fechaTurno = stored.fechaTurno ? vm.moment(stored.fechaTurno).toDate() : false;
            vm.horaTurno = stored.horaTurno ? stored.horaTurno : false;
            vm.data.servicio = stored.servicio ? angular.copy(stored.servicio) : false;
            vm.data.recurso = stored.recurso ? angular.copy(stored.recurso) : false;
            vm.data.sucursal = stored.sucursal ? angular.copy(stored.sucursal) : false;
            vm.data.idItemDePlantilla = stored.idItemDePlantilla ? angular.copy(stored.idItemDePlantilla) : false;
            vm.stateTipoDeAsignacionDeTurnos = stored.stateTipoDeAsignacionDeTurnos ? angular.copy(stored.stateTipoDeAsignacionDeTurnos) : false;

        }
    }

    cleanStorage() {
        this.StorageService.cleanStorage(this.storageKeys.keyRecepcion);
    }

    setStoredData() {

        var recepcionStorageData = {

            fechaTurno: angular.copy(this.data.fechaTurno) || null,
            horaTurno: angular.copy(this.$stateParams.hora) || null,
            servicio: angular.copy(this.data.servicio) || null,
            recurso: angular.copy(this.data.recurso) || null,
            sucursal: angular.copy(this.data.sucursal) || null,
            idItemDePlantilla: angular.copy(this.$stateParams.idItemDePlantilla) || null,

            stateTipoDeAsignacionDeTurnos: angular.copy(this.stateTipoDeAsignacionDeTurnos) || null

        }
        this.StorageService.setStorageObj(this.storageKeys.keyRecepcion, recepcionStorageData);

    }
    //endregion

    /* ---------------------------------------------- WATCHS  ----------------------------------------------- */
    //#region WATCHS
    inicializarWatchs() {

        // WATCH DE AFILIACIONES POR PACIENTE
        this.scope.$watch(() => {
            if (this.pacienteSeleccionado && this.pacienteSeleccionado.Afiliaciones) return this.pacienteSeleccionado.Afiliaciones;
            return null;
        }, (pNewVal) => {
                this.showAlertaIsMutualActiva();
                this.checkPrecioParticularMutual();
        }, true);

        // WATCH DE Control edad
        this.scope.$watch(() => {
            if (this.pacienteSeleccionado) return this.controlEdad;
            return null;
        }, (pNewVal) => {
            this.controlSexoEdad();
        }, true);

        // WATCH DE PRESTACIONES
        this.scope.$watch(() => {
            if (this.prestaciones) return this.prestaciones;
            return null;
        }, (pNewVal) => {
            if (pNewVal) {
                this.checkPrecioParticularMutual();
                // this.prestaciones = this.RecepcionTurnosLogicService.obtenerDatosOrdenadosAlfabeticamente(pNewVal, "Nombre", false);
                // var _ifConsulta = this.prestaciones.find(x => x.Nombre == "CONSULTA");
                // if (_ifConsulta) {
                //     this.prestaciones.find(x => x.Id === _ifConsulta.Id).status = true;
                // } 
            }
        }, true);

        // Watch de paciente seleccionado
        this.scope.$watch(() => {
            if (this.pacienteSeleccionado) return this.pacienteSeleccionado;
            return null;
        }, (pNewVal) => {

            this.$log.debug('cambio paciente', pNewVal);
            //control para reglas y duraciones de
            //voy a consultar si vengo de asignacion, por ende solo puedo asignar para pacientes con particular
            if (this.deshabilitarCambioDia) {
                if (pNewVal.Afiliaciones) {

                    angular.forEach(pNewVal.Afiliaciones, (afiliacion) => {
                        if (afiliacion.EsParticular) {
                            pNewVal.Afiliaciones.find(x => x.Id === afiliacion.Id).PorDefecto = true;
                        } else {
                            pNewVal.Afiliaciones.find(x => x.Id === afiliacion.Id).PorDefecto = false;
                        }
                    })
                    // if (pNewVal.Afiliaciones.find(x => x.EsParticular === true)) {
                    //     pNewVal.Afiliaciones.find(x => x.EsParticular === true).PorDefecto = true;
                    // }
                }
            }
        }, true);

    }

    //#endregion WATCHS
}
