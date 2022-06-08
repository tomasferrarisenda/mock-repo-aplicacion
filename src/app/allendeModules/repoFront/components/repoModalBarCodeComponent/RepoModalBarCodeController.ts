/**
* @author: ppautasso
* @description: controller para modal de barcode
* @type: Controller
**/
import * as angular from 'angular';

// import * as ZXing from '@zxing/library';

export class RepoModalBarCodeController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	dismiss;
	close;
	resolve;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class RepoModalBarCodeController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class RepoModalBarCodeController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('RepoModalBarCodeController');
		this.$log.debug('ON');

		// const codeReader = null;
		// var devices;

		// codeReader.getVideoInputDevices()
		// 	.then(videoInputDevices => {

		// 		devices = angular.copy(videoInputDevices);
		// 		this.$log.debug('Devices',devices);
		// 		this.$log.debug('videoInputDevices',videoInputDevices);

		// 		videoInputDevices.forEach(
		// 			device => console.log(`${device.label}, ${device.deviceId}`)
		// 		);

		// 		if(devices && devices.length){

		// 			const firstDeviceId = devices[1].deviceId;
		// 			codeReader.decodeFromInputVideoDevice(firstDeviceId, 'video')
		// 				.then(result => 
		// 					this.$log.debug('ResultVideoScan',result))
		// 				.catch(
		// 					err => this.$log.error('ErrorVideoScan',err));
		// 		}

		// 	})
		// 	.catch(err => console.error(err));


	}
	// #endregion
}