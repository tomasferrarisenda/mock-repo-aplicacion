/**
* @author:         RecepcionTurnos
* @description:    
* @type:           Directive
**/
import * as angular from 'angular';

export interface IRecepcionTurnosLogicService {
    getCantidadProfesionalesSelected: (recursoXRecepcion) => number;
    obtenerServicioPorId(pId, servicios): any;
    obtenerOptionsEvent(calEvent): any;
    getColorEstadoTurno(estadoTurno: string): any;
    getOpcionesCobertura(coberturas: any): any;
    obtenerSucursalDeBloqueTurnosConHora(bloques: any, horaTurno: any): any;
    obtenerDatosOrdenadosAlfabeticamente(data: any, value: any, reverse: boolean): any;
    openReportesRecepcion(pServicio: any, pFecha: any, servicios: any, pRecepcion: any): any;
    imprimirReporteTurnosPorFechaYProfesional(data: any, observaciones: any, fecha: any, recurso: any, reporteCompleto: boolean, pSucursal: any);
    parsearObservaciones(pObservaciones: any);
    openDocumentosRecepcion(idTurno: number);
    openAnularRecepcion(pTurno: any);
    obtenerTurnosParaAsignarConReglaDuracionDesdeLista(pListaTurnos: any, turno: any): any;
}

class logicService implements IRecepcionTurnosLogicService {

    constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils, private moment, private orderByFilter, private AlertaService) {
        this.$log = this.$log.getInstance('RecepcionTurnosLogicService');
        this.$log.debug('ON');
    }

    static serviceFactory(log, uibModal, dateUtils, moment, orderByFilter, AlertaService) {
        return new logicService(log, uibModal, dateUtils, moment, orderByFilter, AlertaService);
    }


    getCantidadProfesionalesSelected(recursosXRecepcion) {
        var _ret: any = 0;
        angular.forEach(recursosXRecepcion, function (recurso) {
            if (recurso.selected) _ret++;
        })
        return _ret;
    }


    obtenerServicioPorId(pId, servicios) {
        var servicioEncontrado: any;

        angular.forEach(servicios, function (servicio) {
            if (servicio.Id === pId) {
                servicioEncontrado = servicio;
            }
        });

        return servicioEncontrado;
    }


    obtenerOptionsEvent(evento) {

        let options: Array<any> = [];

        if (evento.IdEstado == 1 || evento.IdEstado == 7) {
            options.push({
                id: 1,
                // Se puede receptar si el estado es 1 (Asignado) o 7 (Ausente)
                label: "Receptar"
            });
        }
        if (evento.IdEstado == 2) {
            options.push({
                id: 2,
                // Se puede anular la recepción solo si el estado es 2 (Receptado)
                label: "Anular recepción"
            });
            if (evento.IdEstadoCobranzaCaja == 2) {

                options.push({
                    id: 9,
                    // Marcar como pagado un turno receptado
                    label: "Marcar como Pagado"
                });
            }
            else if (evento.IdEstadoCobranzaCaja == 3) {

                options.push({
                    id: 10,
                    // Anular marcar como pagado un turno receptado
                    label: "Anular marcado como Pagado"
                });
            }
        }
        if (evento.IdEstado == 1) {
            options.push({
                id: 4,
                label: "Editar paciente"
            });
            options.push({
                id: 4,
                label: "Editar financiador"
            });
        }
        if (evento.IdEstado == 8) {
            options.push({
                id: 5,
                // Se puede asignar solo si el estado es 8 (Libre)
                label: "Asignar Este Turno"
            });
        }
        if (evento.IdEstado == 1 || evento.IdEstado == 7) {
            options.push({
                id: 6,
                // Se puede anular si el estado es 1 (Asignado) o 7 (Ausente)
                label: "Anular"
            });
        }
        if (evento.IdEstado !== 8) {
            options.push({
                id: 7,
                // Se puede ver el log de auditoría salvo que el turno esté libre (8)
                label: "Ver Auditoría"
            });
        }

        return options;
    }


    getColorEstadoTurno(estadoTurno) {

        var ret;

        if (estadoTurno) {

            var _coloresEstadoTurno: any = [];

            _coloresEstadoTurno = [
                {
                    nombre: 'turnos-Atendido-color',
                    backgroundColor: '#0E74D0'
                },
                {
                    nombre: 'turnos-Libre-color',
                    backgroundColor: '#5cb85c'
                },
                {
                    nombre: 'turnos-Asignado-color',
                    backgroundColor: '#6FAADE'
                },
                {
                    nombre: 'turnos-Cancelado-color',
                    backgroundColor: 'rgba(221, 29, 29, 0.74)'
                },
                {
                    nombre: 'turnos-Ausente-color',
                    backgroundColor: 'rgb(197, 197, 197)'
                },
                {
                    nombre: 'turnos-Atentiendo-color',
                    backgroundColor: 'rgba(232, 228, 44, 0.56)'
                }, {
                    nombre: 'turnos-Anulado-color',
                    backgroundColor: 'rgba(128, 128, 128, 0.74)'
                },
                {
                    nombre: 'turnos-Receptado-color',
                    backgroundColor: '#ffa500'
                }];

            ret = _coloresEstadoTurno.find(x => x.nombre === estadoTurno).backgroundColor;
        }

        return ret;

    }

    getOpcionesCobertura(coberturas) {

        let options: Array<any> = [];
        angular.forEach(coberturas, (cobertura) => {


            options.push({
                idMutual: cobertura.IdMutual,
                idPlanMutual: cobertura.IdPlanMutual,
                label: cobertura.MutualNombre,
                disabled: !cobertura.MutualActiva
            });
        })

        return options;
    }

    obtenerSucursalDeBloqueTurnosConHora(bloques, horaTurno) {

        this.$log.debug('obtenerSucursalDeBloqueTurnosConHora', bloques, horaTurno);
        var sucursal = {
            Id: 0,
            Nombre: ''
        };

        angular.forEach(bloques, (bloque) => {

            this.$log.debug('bloque turno', bloque, horaTurno);
            var horaToCompare = this.moment(String(horaTurno.getHours()) + ":" + String(horaTurno.getMinutes()), "h:mm").format('HH:mm');
            if ((bloque.HoraDesde <= horaToCompare && horaToCompare <= bloque.HoraHasta)) {
                sucursal = angular.copy(bloque.Sucursal);
            }

        });
        return sucursal;
    }

    obtenerDatosOrdenadosAlfabeticamente(data, value, reverse) {
        let dataOrdenada: any;

        dataOrdenada = angular.copy(this.orderByFilter(data, value, reverse));

        return dataOrdenada;
    }

    openReportesRecepcion(pServicio, pFecha, pServicios, pRecepcion) {
        return this.$uibModal.open({
            component: 'saReporteTurnosDelDiaProfesional',
            size: 'md',
            keyboard: true,
            resolve: {
                Servicio: function () {
                    return pServicio;
                },
                Fecha: function () {
                    return pFecha;
                },
                Servicios: function () {
                    return pServicios;
                },
                Recepcion: function () {
                    return pRecepcion;
                }
            }
        }).result;
    }

    imprimirReporteTurnosPorFechaYProfesional(data, observaciones, fecha, recurso, pReporteCompleto, pSucursal) {
        return this.$uibModal.open({
            component: 'saImprimirReporteTurnosPorFechaYProfesional',
            size: 'lg',
            keyboard: true,
            resolve: {
                Data: function () {
                    return data;
                },
                Observaciones: function () {
                    return observaciones;
                },
                Fecha: function () {
                    return fecha;
                },
                Recurso: function () {
                    return recurso;
                },
                ReporteCompleto: function () {
                    return pReporteCompleto
                },
                Sucursal: function () {
                    return pSucursal;
                }
            }
        }).result;
    }


    openDocumentosRecepcion(idTurno) {
        return this.$uibModal.open({
            component: 'saDocumentosRecepcion',
            size: 'md',
            keyboard: true,
            resolve: {
                IdTurno: idTurno
            }
        }).result;
    }

    parsearObservaciones(pObservaciones) {
        let ret = "";
        angular.forEach(pObservaciones, (observacion) => {
            ret = ret + observacion.Usuario + ' - ' + this.moment(observacion.Fecha).format("DD/MM/YYYY - HH:mm:ss") + ": \r\n" + observacion.Observacion + "\r\n" + "\r\n";
        });

        return ret;
    }

    openAnularRecepcion(pTurno) {
        return this.$uibModal.open({
            component: 'saAnularRecepcion',
            size: 'md',
            keyboard: true,
            resolve: {
                Turno: function () {
                    return pTurno;
                }
            }
        }).result;
    }

    obtenerTurnosParaAsignarConReglaDuracionDesdeLista(listaTurnos, turno) {
        // devolveremos turnos para asignar con duracion o no
        var _ret = {
            lista: '',
            estadORet: false
        }
        var _lista = [];

        if (turno.DuracionIndividualRegla !== 0) {

            this.$log.debug('tengo duracion de turno');

            //llamo a la funcion recursiva
            this.checkTurnosDuracionRecursive(turno, listaTurnos);

            //ya tengo seleccionados los turnos pero vuelvo a preguntar si hay algun error
            if (this.checkIfTurnosMultiplesError(turno, listaTurnos)) {
                
                this.AlertaService.NewWarning("Alerta",
                    "El turno seleccionado no cumple con requisitos minimos de duracion. Seleccione otro turno");
                    _ret.estadORet = false;
            }else {
                //devuelvo lista con selected
                _ret.lista = angular.copy(listaTurnos.filter(x => x.selected));
                _ret.estadORet = true;
            }

        }

        return _ret;
    }

    checkIfTurnosMultiplesError(turno, listaTurnos) {

        var ret = false;
        //obtengo los turnos del recurso del turno seleccionado
        var turnosPorRecursoClick = listaTurnos;

        if (this.getDuracionTotalTurnosPorRecursoSelected(turnosPorRecursoClick) < turno.DuracionIndividualRegla) {

            ret = true;
            
        }

        return ret;
    }

    // SUPPORT PARA OBTENER REGLAS DE DURACION DE LISTA TURNOS
    checkTurnosDuracionRecursive(turno, lista) {
        if (turno !== '') {

            this.selectTurno(turno.IdRow, lista);
            var turnosPorRecursoClick = lista;

            this.$log.debug('getTurnosPorRecurso', turnosPorRecursoClick);
            if (this.getDuracionTotalTurnosPorRecursoSelected(turnosPorRecursoClick) < turno.DuracionIndividualRegla) {

                this.checkTurnosDuracionRecursive(this.getSiguienteTurno(turno, lista), lista);
            } else return;

        } else return;

    }

    getDuracionTotalTurnosPorRecursoSelected(turnosPorRecursoColleccion) {

        var duracionTotal = 0;

        angular.forEach(turnosPorRecursoColleccion, function (turno, key) {
            if (turno.selected)
                duracionTotal = duracionTotal + turno.Duracion;
        });
        return duracionTotal;
    }

    getSiguienteTurno(_turno, lista) {

        var turnoSiguiente = '';

        var turnosPorRecursoClick = lista;
        var _horaTurnoSiguiente = this.moment(_turno.Hora, 'HH:mm').
            add(_turno.Duracion, 'minutes');

        angular.forEach(turnosPorRecursoClick, function (Turno, key) {

            if (Turno.Hora === _horaTurnoSiguiente.format('HH:mm') && _turno.IdRecurso === Turno.IdRecurso) {
                turnoSiguiente = angular.copy(Turno);
            }
        });

        return turnoSiguiente;
    }

    selectTurno(idRow, lista) {

        angular.forEach(lista, function (row, key) {
            if (row.IdRow === idRow) row.selected = true;
        });
    }

}

logicService.serviceFactory.$inject = ['Logger', '$uibModal', 'DateUtils', 'moment', 'orderByFilter', 'AlertaService'];

export class RecepcionTurnosLogicService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('RecepcionTurnosLogicService', logicService.serviceFactory)
    }
}