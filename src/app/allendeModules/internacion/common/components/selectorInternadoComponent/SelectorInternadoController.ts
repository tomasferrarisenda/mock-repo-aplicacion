/**
* @author: ppautasso
* @description: controller para selector de internado
* @type: Controller
**/
import * as angular from 'angular';
import { IInternacionesDataService } from '../../services';

export class SelectorInternadoController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	internado;
	cols;
	
	private _numeroInternado : string = "";
	public get numeroInternado() : string {
		return this._numeroInternado;
	}
	public set numeroInternado(v : string) {
		this._numeroInternado = v;
	}
	
	
	// #endregion
	loading: boolean = false;
	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'InternacionesDataService', 'AlertaService', 'InternacionCommonLogicService'];
	/**
	* @class SelectorInternadoController
	* @constructor
	*/
	constructor(private $log: ILogger, private InternacionesDataService:IInternacionesDataService, 
		private AlertaService:IAlertaService, private InternacionCommonLogicService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscarInternadoPorNumero(numeroInternado, openBuscador){

		if(numeroInternado && numeroInternado > 0){
			this.loading = true;
			this.$log.debug('busco internado',numeroInternado);
			this.InternacionesDataService.obtenerInternadoPorNumeroInternacion(numeroInternado)
			.then( (pResult) => {
				this.$log.debug('pResult',pResult);
				this.loading = false;
				if(pResult){
					pResult.NombreYApellidoInternado = pResult.ApellidoPaciente + ', ' + pResult.NombrePaciente;
					pResult.DocumentoYTipoInternado = pResult.TipoDocumento + ': ' + pResult.NumeroDocumento;
					this.internado = angular.copy(pResult);
				}else {
					// levanto buscador y muestro alerta que no hay internados
					this.AlertaService.NewWarning("No se encontraron internados con el numero: " + numeroInternado);
					this.limpiarInternado();
					this.openModalBuscadorInternado();
				}
			}, (pError) => {
				this.$log.error('pError',pError);
				this.loading = false;
			});
		}else {
			if(openBuscador) this.openModalBuscadorInternado();
		}
	}

	buscarInternadoPorNumeroBlur(numeroInternado, openBuscador){
		if(numeroInternado && numeroInternado != 0){
			this.buscarInternadoPorNumero(numeroInternado, openBuscador);
		}
	}

	openModalBuscadorInternado(){
		// levanto modal internado para buscar
		this.InternacionCommonLogicService.openBuscadorInternado()
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			if(pResult.NumeroInternado !== 0){
				this.buscarInternadoPorNumero(pResult.NumeroInternado, false);
				this.numeroInternado = angular.copy(pResult.NumeroInternado);
			}
		}, (pError) => {
			this.$log.error('pError',pError);
		});
	}

	abrirInfoInternado(){
		this.InternacionCommonLogicService.openInfoBuscadorInternado(this.internado);
	}

	limpiarInternado(){
		delete this.internado;
		this.numeroInternado = "";
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class SelectorInternadoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('SelectorInternadoController');
		this.$log.debug('ON');
	}
	// #endregion
}