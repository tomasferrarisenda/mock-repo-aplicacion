/**
 * @author:			Ezequiel Mansilla
 * @description:	Permisos para estados de cama
 * @type:			Constant
 */
export default (function () {

    const module = { init: (ngModule: any) => { } };

    module.init = function (module) {

        module.constant('PERMISSION_REPROGRAMACION_TURNOS', {
          REPROGRAMACION: 242
        });

    };
    return module;

})();