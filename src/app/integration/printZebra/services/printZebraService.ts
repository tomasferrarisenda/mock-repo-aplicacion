/**
* @author: ppautasso
* @description: Servicio para utilizar la impresion con zebra
* @type: Service
**/
import * as angular from 'angular';

export interface IPrintZebraService {
	setupWebPrint(): any;
	sendData(printData: string): any;
}

class logicService implements IPrintZebraService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	available_printers: any;
	selected_category: any;
	default_printer: any;
	selected_printer: any;
	format_start = "^XA^LL200^FO80,50^A0N36,36^FD";
	format_end = "^FS^XZ";
	default_mode = true;

	/**
	* @class PrintZebraService
	* @constructor
	*/
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils, 
		private browserPrint, private AlertaService:IAlertaService, private $q) {
		this.$log = this.$log.getInstance('PrintZebraService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	setupWebPrint() {

		var def = this.$q.defer();
		// body
		this.default_mode = true;
		this.selected_printer = null;
		this.available_printers = null;
		this.selected_category = null;
		this.default_printer = null;

		this.$log.debug('browserprint', this.browserPrint);

		this.browserPrint.getDefaultDevice('printer', (printer) =>
		{
		this.default_printer = printer
		if((printer != null) && (printer.connection != undefined))
		{
			this.selected_printer = printer;
			def.resolve(true);
		
		}else {
			this.showErrorMessage("No se encontro una impresora ");
			def.reject(false);
		}
		// this.browserPrint.getLocalDevices((printers) =>
		// 	{
		// 		this.available_printers = printers;
		// 		var sel = document.getElementById("printers");
		// 		var printers_available = false;
		// 		if(sel){
		// 			sel.innerHTML = "";
		// 			if (printers != undefined)
		// 			{
		// 				for(var i = 0; i < printers.length; i++)
		// 				{
		// 					if (printers[i].connection == 'usb')
		// 					{
		// 						var opt = document.createElement("option");
		// 						opt.innerHTML = printers[i].connection + ": " + printers[i].uid;
		// 						opt.value = printers[i].uid;
		// 						sel.appendChild(opt);
		// 						printers_available = true;
		// 					}
		// 				}
		// 			}
		// 		}
				
		// 		if(!printers_available)
		// 		{
		// 			this.showErrorMessage("No Zebra Printers could be found!");
					
		// 			$('#print_form').hide();
		// 			return;
		// 		}
		// 		else if(this.selected_printer == null)
		// 		{
		// 			this.default_mode = false;
		// 			this.showErrorMessage("Selected Printer == null");			
		// 			//changePrinter();
		// 			//$('#print_form').show();
					
		// 		}
		// 	}, undefined, 'printer');
	}, (error_response) =>
		{
		this.showErrorMessage("No se encontro una impresora " + error_response);
		def.reject(error_response);
		});
		return def.promise;
	}

	sendData(printData: string) {

		var def = this.$q.defer();
		this.setupWebPrint()
		.then( (pResultSetupWebPrint) => {
			this.$log.debug('pResultSetupWebPrint',pResultSetupWebPrint);
			if(this.selected_printer == null){
				this.AlertaService.NewWarning("No existe ninguna impresora Zebra para imprimir");
				def.reject(false);
			}else {
	
				this.checkPrinterStatus((text) => {
				this.$log.debug('printerStatus',text);
					if (true) {
						this.selected_printer.send(printData, 
						(printComplete)=>{
							
							def.resolve(true);
						}, (printerError) => {
							this.$log.error('impresion error',printerError);
							def.reject(printerError);
						});
					}
					else {
						this.$log.debug('PrintError printer no ready to test',text);
					}
				});
			}
		}, (pError) => {
			this.$log.error('pError',pError);
			def.reject(pError);
		});

		return def.promise;
	}


	checkPrinterStatus(finishedFunction) {
		if(this.selected_printer){
			this.selected_printer.sendThenRead("~HQES",
			(text) => {
				var that = this;
				var statuses = new Array();
				var ok = false;
				var is_error = text.charAt(70);
				var media = text.charAt(88);
				var head = text.charAt(87);
				var pause = text.charAt(84);
				// check each flag that prevents printing
				if (is_error == '0') {
					ok = true;
					statuses.push("Ready to Print");
				}
				if (media == '1')
					statuses.push("Paper out");
				if (media == '2')
					statuses.push("Ribbon Out");
				if (media == '4')
					statuses.push("Media Door Open");
				if (media == '8')
					statuses.push("Cutter Fault");
				if (head == '1')
					statuses.push("Printhead Overheating");
				if (head == '2')
					statuses.push("Motor Overheating");
				if (head == '4')
					statuses.push("Printhead Fault");
				if (head == '8')
					statuses.push("Incorrect Printhead");
				if (pause == '1')
					statuses.push("Printer Paused");
				if ((!ok) && (statuses.length == 0))
					statuses.push("Error: Unknown Error");
				finishedFunction(statuses.join());
			}, (error) => {
				this.$log.error('error sendThenRead',error);
				
			});
		}
		
	};


	showErrorMessage(str){
		this.$log.error('errorPrintService',str);
	}

	static serviceFactory() {
		const service = (log, uibModal, dateUtils, browserPrint, AlertaService, $q) => new logicService(log, uibModal, dateUtils, browserPrint, AlertaService, $q);
		service.$inject = ['Logger', '$uibModal', 'DateUtils', 'BrowserPrintService', 'AlertaService', '$q'];
		return service
	}

	// #endregion
}

export class PrintZebraService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('PrintZebraService', logicService.serviceFactory())
	}
}