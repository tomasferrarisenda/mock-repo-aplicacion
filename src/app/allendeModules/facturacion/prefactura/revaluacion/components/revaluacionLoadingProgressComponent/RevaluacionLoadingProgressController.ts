/**
* @author: ppautasso
* @description: controller para revaluacion lading progress
* @type: Controller
**/
import * as angular from 'angular';

export class RevaluacionLoadingProgressController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };
    // mas propiedades ..
    resolve;
	dismiss;
    close;
    
    size;

    refreshBool = true;;
    error = false;
    
    private _progress : any;
    public get progress() : any {
        return this._progress;
    }
    public set progress(v : any) {
        this._progress = v;
        if (v.pProgress == this.size) this.cerrar(true);
    }
    
    
    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', '$scope'];
    /**
    * @class RevaluacionLoadingProgressController
    * @constructor
    */
    constructor(private $log: ILogger, private $scope) {
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	cerrar(val) {
		this.close({ $value: val });
    }
    
  

    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class RevaluacionLoadingProgressController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {
        this.$log = this.$log.getInstance('RevaluacionLoadingProgressController');
        this.$log.debug('ON');

        this.size = this.resolve.Tamaño;

        if (this.size == 0) { 
            this.close(true);
        }


        this.$scope.$on('progressRevaluacionFacturacion',(event, data) => {
            this.$log.debug('Message', data);
            this.progress = angular.copy(data);
            if (data.error === true) { 
                this.error = true;
            }
            this.$log.debug('Progress', this.progress);
        });    

   
    }
    // #endregion
}