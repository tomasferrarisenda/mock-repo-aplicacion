/**
* @author: ppautasso
* @description: controller para barcode scanner
* @type: Controller
**/
import * as angular from 'angular';

// import * as ZXing from '@zxing/library';

export class BarCodeScannerController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	scanResult;
	typeScan;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class BarCodeScannerController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class BarCodeScannerController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('BarCodeScannerController');
		this.$log.debug('ON');

		// let codeReader;
		// if(this.typeScan === "barcode"){
		// 	codeReader = new ZXing.BrowserBarcodeReader();

		// }else if(this.typeScan === "qrcode") {
		// 	codeReader = new ZXing.BrowserQRCodeReader();

		// }

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
		// 			.then( (pResult) => {

		// 				this.$log.debug('ResultVideoScan',pResult);
		// 				navigator.vibrate(500);
		// 				this.scanResult({
		// 					pObject: pResult
		// 				});

		// 			}, (pError) => {
		// 				this.$log.error('ErrorVideoScan',pError)
		// 			});

		// 		}

		// 	})
		// 	.catch(err => console.error(err));

	}
	// #endregion
}