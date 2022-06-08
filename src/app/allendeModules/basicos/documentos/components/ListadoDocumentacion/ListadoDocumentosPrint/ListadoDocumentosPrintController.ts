/**
* @author: pf
* @description: lalala
* @type: Controller
**/
import * as angular from 'angular';

export class ListadoDocumentosPrintController implements angular.IController {
    resolve: any;
    close: any;
    dismiss: any;
    
    static $inject: Array<string> = ['Logger'];
    constructor(private $log: ILogger) {
    }

    $onInit() {
        this.$log = this.$log.getInstance('ListadoDocumentosPrintController');
        this.$log.debug('ON');
        setTimeout(function (){ window.print();}, 1000);
    }
}