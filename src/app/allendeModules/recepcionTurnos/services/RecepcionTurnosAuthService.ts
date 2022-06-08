/**
 * @author 			ppautasso
 * @description 	Auth service para Recepcion turno
 */
export default (function () {
    'use strict';

    const module = { init: (ngModule: any) => { } };

    module.init = function (module) {

        module.factory('RecepcionTurnosAuthService', RecepcionTurnosAuthService);

        RecepcionTurnosAuthService.$inject = ['AuthorizationService', 'SecurityLogicService', 'Logger',
            'PERMISSION_RECEPCION'
        ];

        function RecepcionTurnosAuthService(AuthorizationService, SecurityLogicService, $log,
            PERMISSION
        ) {

            /* ------------------------------------------------ LOG ------------------------------------------------ */

            $log = $log.getInstance('RecepcionTurnosAuthService');
            $log.debug('ON.-');

            /* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

            const service = {

                tienePermisoRecepcion: tienePermisoRecepcion,
            };
            return service;

            /* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

            function tienePermisoRecepcion(pUser) {
                return AuthorizationService.tienePermisoById(pUser, PERMISSION.LIST);
            }

        }
    };

    return module;
})();