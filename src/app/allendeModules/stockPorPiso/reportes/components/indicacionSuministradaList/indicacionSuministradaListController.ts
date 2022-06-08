/**
* @author:         emansilla
* @description:    Listado de indicaciones suministradas
* @type:           Controller
**/
import * as angular from 'angular';

export class IndicacionSuministradaListController implements angular.IController {

    // ID
    static $inject: Array<string> = ['Logger'];
    // Constructor
    constructor(private $log: ILogger) {
    }

    public method(param1: string): void {

    }

    private method2(param1: string): void {

    }

    $onInit() {
        this.$log = this.$log.getInstance('IndicacionSuministradaListController');
        this.$log.debug('ON');
    }
}