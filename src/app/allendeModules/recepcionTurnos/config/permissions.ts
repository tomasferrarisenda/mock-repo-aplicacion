/**
 * @author:			ppautasso
 * @description:	Permisos para recepcion de turnos
 * @type:			Constant
 */
export default (function () {
    'use strict';

    const module = { init: (ngModule: any) => { } };

    module.init = function (module) {

        module.constant('PERMISSION_RECEPCION', {
            LIST: 236,
            // NEW: 183,			
            // EDIT: 179,
            // DELETE: 182,
            // APLICAR : 180,
            // VIEW: 181

        });


    };
    return module;
})();
