/**
* @author: ppautasso
* @description: controller para devolver parcial asignacion
* @type: Controller
**/
import * as angular from 'angular';
import { IMovimientoStockPisoDataService } from '../../../services/movimientos';
import { MovimientoStockAsignacionViewDto } from '../../../models';

export class EnfermeriaDevolverParcialAsignacionController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	close;
	loading: boolean = false;

	seleccionarTodos: boolean = false;
	idMovimiento: number = 0;

	movimientoStockAsignacionView: MovimientoStockAsignacionViewDto = {};
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'MovimientoStockPisoDataService', 'AlertaService'];
	/**
	* @class EnfermeriaDevolverParcialAsignacionController
	* @constructor
	*/
	constructor(private $log: ILogger, private MovimientoStockPisoDataService: IMovimientoStockPisoDataService,
			private AlertaService: IAlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	cerrar(pClose) {
		this.close({ $value: pClose });
	}


	seleccionarTodosChange(){

		if(this.movimientoStockAsignacionView && this.movimientoStockAsignacionView.Items && this.movimientoStockAsignacionView.Items.length){
			this.movimientoStockAsignacionView.Items.forEach(item => {
				if(item.PuedeDevolver){
					item.Devolver = this.seleccionarTodos;
				}
			});
		}
	}

	devolver(){

		if(!this.movimientoStockAsignacionView.ObservacionDevolucion){
			this.AlertaService.NewWarning("Debe ingresar una observación para devolver");
		}else {
			this.loading = true;
			this.MovimientoStockPisoDataService.realizarDevolucionParcialDeAsignacion(this.movimientoStockAsignacionView)
			.then( (pResult) => {
				this.$log.debug('pResult',pResult);
				if(pResult.IsOk){
					this.AlertaService.NewSuccess("Devolución Correcta");
					this.cerrar(true);
				}else {
					this.AlertaService.NewWarning("Error", pResult.Message);
				}
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError',pError);
				this.loading = false;
			});
		}

	}

	changeSelectItem(item){

		if(this.movimientoStockAsignacionView.Items){
			if(!this.movimientoStockAsignacionView.Items.find(x => x.Devolver)) this.seleccionarTodos = false;
		}
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class EnfermeriaDevolverParcialAsignacionController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaDevolverParcialAsignacionController');
		this.$log.debug('ON');

		this.idMovimiento = this.resolve.IdMovimiento;

		this.loading = true;
		this.MovimientoStockPisoDataService.obtenerMovimientoAsignacionADevolver(this.idMovimiento)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.movimientoStockAsignacionView = pResult;
			this.seleccionarTodos = true;
			this.seleccionarTodosChange();
			this.loading = false;

		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
	}
	// #endregion
}