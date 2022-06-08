/**
* @author: ppautasso
* @description: controller para enfermeria seleccionador de internados
* @type: Controller
**/
import * as angular from 'angular';

export class EnfermeriaSeleccionadorInternadosController implements angular.IController {

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

	internados: any;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q', 'PrintZebraService'];
	/**
	* @class EnfermeriaSeleccionadorInternadosController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q, private PrintZebraService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	cerrar(pClose) {
		this.close({ $value: pClose });
	}

	selectOption(internado) {
		this.$log.debug('seleccionar internado', internado);
		this.cerrar(internado);
	}

	imprimirEtiqueta(internado) {

		var def = this.$q.defer();

		if (internado) {

			this.PrintZebraService.sendData(
				"CT~~CD,~CC^~CT~" +
				"^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR5,5~SD15^JUS^LRN^CI0^XZ" +
				"^XA" +
				"^MMT" +
				"^PW591" +
				"^LL0264" +
				"^LS0" +
				"^FT561,222^A0I,34,33^FH\^FD" + internado.Paciente + "^FS" +
				"^FT561,146^A0I,28,28^FH\^FDNum. Int:" + internado.NumeroInternado + "^FS" +
				"^FT561,36^A0I,25,24^FH\^FDFECHA:^FS" +
				"^FT561,80^A0I,23,24^FH\^FDCama: " + internado.NumeroCama + "^FS" +
				"^FT561,108^A0I,23,24^FDHabitacion: " + internado.Habitacion + "^FS" +
				"^FT561,184^A0I,28,28^FH\^FD" + internado.TipoDocumento + ": " + internado.NumeroDocumento + "^FS" +
				"^FT65,173^BQN,2,5" +
				"^FH\^FDMA," + internado.NumeroInternado + "^FS" +
				"^PQ1,0,1,Y^XZ"
			)
				.then((pResultSendData) => {
					this.$log.debug('pResultSendData', pResultSendData);
					def.resolve(true);
				}, (pError) => {
					this.$log.error('Error al imprimir', pError);
					this.$log.debug('tuve un error al imprimir, voy a intentar una vez mas');
					// no pude imprimir voy a internarlo una vez mas
					if (internado) {


						this.PrintZebraService.sendData(
							"CT~~CD,~CC^~CT~" +
							"^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR5,5~SD15^JUS^LRN^CI0^XZ" +
							"^XA" +
							"^MMT" +
							"^PW591" +
							"^LL0264" +
							"^LS0" +
							"^FT561,222^A0I,34,33^FH\^FD" + internado.Paciente + "^FS" +
							"^FT561,146^A0I,28,28^FH\^FDNum. Int:" + internado.NumeroInternado + "^FS" +
							"^FT561,36^A0I,25,24^FH\^FDFECHA:^FS" +
							"^FT561,80^A0I,23,24^FH\^FDCama: " + internado.NumeroCama + "^FS" +
							"^FT561,108^A0I,23,24^FDHabitacion: " + internado.Habitacion + "^FS" +
							"^FT561,184^A0I,28,28^FH\^FD" + internado.TipoDocumento + ": " + internado.NumeroDocumento + "^FS" +
							"^FT65,173^BQN,2,5" +
							"^FH\^FDMA," + internado.NumeroInternado + "^FS" +
							"^PQ1,0,1,Y^XZ"
						).then((pResultOneMore) => {
							this.$log.debug('pResultOneMore', pResultOneMore);
							def.resolve(true);
						}, (pError2) => {
							this.$log.error('pError2', pError2);
							def.reject(pError2);
						});
					}

				});
		}

		return def.promise;

	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class EnfermeriaSeleccionadorInternadosController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaSeleccionadorInternadosController');
		this.$log.debug('ON');

		this.internados = angular.copy(this.resolve.InternadosList);


	}
	// #endregion
}