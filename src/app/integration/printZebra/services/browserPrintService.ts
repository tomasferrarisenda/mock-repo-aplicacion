/**
* @author: emansilla
* @description: BrowserPrint wrapper
* @type: Service
**/
import * as angular from 'angular';
import { BrowserPrint } from  "../../../../js/BrowserPrint-1.0.4.min";

export class BrowserPrintService {
	static init(ngModule: angular.IModule) {
		ngModule.value('BrowserPrintService', BrowserPrint)
	}
}