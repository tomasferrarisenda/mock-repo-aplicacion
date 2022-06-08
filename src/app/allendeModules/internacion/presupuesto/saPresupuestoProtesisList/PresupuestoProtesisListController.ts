export class PresupuestoProtesisListController {
    static $inject: Array<string> = ['Logger', 'PresupuestoProtesisDataService', 'PresupuestoProtesisLogicService', 'AlertaService'];

    idIntervencion: any;
    data: Array<any> = [];

    constructor(
        private $log: ILogger,
        private PresupuestoProtesisDataService: any,
        private PresupuestoProtesisLogicService: any,
        private AlertaService: any) {
        this.$log = $log.getInstance('PresupuestoProtesisListController');
        this.$log.debug('ON.-');
    }

    public btnNewClick() {
        this.crearPresupuesto();
    }

    public btnEditClick(pDetalle) {
        this.editPresupuesto(pDetalle);
    }

    public btnPrintClick(pDetalle) {
        this.printPresupuesto(pDetalle);
    }

    public $onChanges() {
        this.$log.debug('updateComponent');
    }

    private crearPresupuesto() {
        var vm = this;
        this.PresupuestoProtesisLogicService.openNew(this.idIntervencion)
            .then(crearPresupuestoOk, crearPresupuestoError);

        function crearPresupuestoOk(pResult) {
            vm.$log.debug('crearPresupuesto ok', pResult);
            vm.AlertaService.NewSuccess('Se creó correctamente el presupuesto.');
            vm.initData();
        }

        function crearPresupuestoError(pError) {
            vm.$log.debug('crearPresupuesto error', pError);
        }
    }

    private editPresupuesto(pDetalle) {
        var vm = this;
        this.PresupuestoProtesisLogicService.openEdit(pDetalle.Id)
            .then(editPresupuestoOk, editPresupuestoError);

        function editPresupuestoOk(pResult) {
            vm.$log.debug('editPresupuestoOk ok', pResult);
            vm.AlertaService.NewSuccess('Se editó correctamente el presupuesto.');
            vm.initData();
        }

        function editPresupuestoError(pError) {
            vm.$log.debug('editPresupuestoError error', pError);
        }
    }

    private printPresupuesto(pDetalle) {
        var vm = this;
        vm.PresupuestoProtesisLogicService.printOne(pDetalle.Id, pDetalle.IdIntervencionAdmision)
            .then(printPresupuestoOk, printPresupuestoError);

        function printPresupuestoOk(pResult) {
            vm.$log.debug('printPresupuestoOk ok', pResult);
        }

        function printPresupuestoError(pError) {
            vm.$log.debug('printPresupuestoError error', pError);
        }
    }

    /* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

    private initData() {
        var vm = this;
        vm.PresupuestoProtesisDataService.GetAll(vm.idIntervencion)
            .then(initDataOk);

        function initDataOk(pPresupuestos) {
            vm.data = pPresupuestos;
        }
    }

    $onInit() {
        this.$log.debug('$onInit');
        this.initData();
    }
}