/**
 * @author: pablo pautasso
 * @description: Controller para seleccionar solicidutes de estudio
 * @type: Controller
 **/
import * as angular from 'angular';
import { IBateriaEstudiosDataService } from 'src/app/allendeModules/basicos/bateriaEstudios/services';


export class SeleccionarSolicitudEstudiosModalController implements angular.IController {

	resolve;
	dismiss;
	close;

	paciente;
	itemsDeSolicitudes;
	elementoSeleccionado;
	solicitudACancelar;

	motivosCancelacionSolicitud;

	motivoCancelacionTurno;
	observacionesParaEliminar;
	
	loading = false;

	// ID
	static $inject: Array < string > = ['Logger','$filter', 'AlertaService', 'bateriaEstudiosDataService'];
	// Constructor
	constructor(private $log: ILogger, private $filter, private AlertaService: IAlertaService, private bateriaEstudiosDataService: IBateriaEstudiosDataService) {}

	title = {
		name: 'Seleccionar Solicitud de Estudios',
		icon: 'LIST'
	};

	$onInit() {

		this.$log = this.$log.getInstance('SeleccionarSolicitudEstudiosModalController');
		this.$log.debug('ON');
	

		this.obtenerMotivosNoSolicitud();

		this.paciente = this.resolve.Paciente;
		//tengo que parsear por si hay solicitudes de especialidades distintas
		let keysToExtract: Array<any> = [];

		console.log(this.resolve.Solicitudes);
		angular.forEach(this.resolve.Solicitudes, (_solicitud, key) => {
			
			if(_solicitud.ItemsSinTurno.length > 1 && _solicitud.ItemsSinTurno[0].IdEspecialidad != 0){
				//tengo una solicitud que tiene especialidades diferentes => la tengo que agrupar
				keysToExtract.push(key);
			}
		});

		for (var i = 0; i < keysToExtract.length; i++) {
			//recorro las keys para extraer 
			let solicitudAExtraer = this.resolve.Solicitudes.splice(keysToExtract[i], 1);
			let _itemsSinTurno = angular.copy(solicitudAExtraer[0].ItemsSinTurno);
			solicitudAExtraer[0].ItemsSinTurno.length = 0;
			let grupos = this.groupBy(_itemsSinTurno, "IdEspecialidad");
			angular.forEach(grupos, (_grupo, key) => {
				let solicitudAAgregar = angular.copy(solicitudAExtraer[0]);
				solicitudAAgregar.ItemsSinTurno = _grupo;
				this.resolve.Solicitudes.push(solicitudAAgregar);
			});
		}

		angular.forEach(this.resolve.Solicitudes, (sol, key) => {
			sol.idSelected = key;
		});
		this.itemsDeSolicitudes = angular.copy(this.resolve.Solicitudes);

	}


	obtenerMotivosNoSolicitud(){

		this.loading = true;

		this.bateriaEstudiosDataService.obtenerMotivosSolicitudNoAsignable()
		.then((motivosCancelacion) => {
			
			this.loading = false;
			console.log(motivosCancelacion);
			this.motivosCancelacionSolicitud = motivosCancelacion;

		}, (pError) => {
			this.loading = false;
		});
	}

	select(item){
		
		this.elementoSeleccionado = item;
	}


	cancel() {
		this.dismiss({
			$value: 'cancel'
		});
	}

	seleccionarSolicitud() {
		if(this.elementoSeleccionado && this.elementoSeleccionado.Id){
			this.close({$value: this.elementoSeleccionado});
	
		}else {
			this.AlertaService.NewWarning("Debe elegir una solicitud de estudio.");
            return;
		}

	}


	cancelarSolicitud(solicitud){
		this.solicitudACancelar = solicitud;
	}

	confirmarCancelarTurno() {
		if(!this.motivoCancelacionTurno)
		{
			this.AlertaService.NewWarning("Debe seleccionar un motivo");
			return;
		}

		if(this.motivoCancelacionTurno && this.motivoCancelacionTurno.requiereObservacion && !this.observacionesParaEliminar){
			this.AlertaService.NewWarning("Debe completar la observación");
			return;
		}

		let _solicitudACancelarDto = {
			IdSolicitud: this.solicitudACancelar.Id,
			IdMotivoNoAsignable: this.motivoCancelacionTurno.Id,
			Observacion: (this.observacionesParaEliminar && this.motivoCancelacionTurno.RequiereObservacion) ? this.observacionesParaEliminar : ""
		};


		this.bateriaEstudiosDataService.pasarSolicitudComoNoAsignableEnTurnos(_solicitudACancelarDto)
		.then((result) => {
			this.loading = false;
			//tengo solicitudes => tengo que mostrar modal para seleccionar
			if(result.IsOk){
				//cierro modal con advertencias
				this.close({$value: "canceleSolicitud"});
			}else {
				this.AlertaService.NewWarning("No se pudo cancelar la solicitud. " + result.Message);
			}
		}, (pError) => {
			this.loading = false;
		});

	}

	groupBy (array, key) {
		return array.reduce(function(rv, x) {
		  (rv[x[key]] = rv[x[key]] || []).push(x);
		  return rv;
		}, {});
	  };




}