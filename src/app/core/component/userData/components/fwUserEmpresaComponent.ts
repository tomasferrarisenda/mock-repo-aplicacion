/**
 * @author:			Pablo Pautasso
 * @description:	componente para header de empresa
 * @type:			Directive
 **/
import * as angular from 'angular';
import saUserEmpresaTemplate = require('../components/fw-user-empresa.tpl.html');
import { ISecurityDataService, ICredentialsDataService } from 'core/security';

export default (function () {
    'use strict';

    const module = { init: (ngModule: any) => { } };

    module.init = function (module) {

        module.component('saUserEmpresa', {
            template: saUserEmpresaTemplate,
            bindings: {

            },
            controller: UserEmpresaController,
            controllerAs: 'vm'
        });

        UserEmpresaController.$inject = ['$q', 'Logger', 'CredentialsDataService', 'UserInfoDataService', 'UsuarioGestionDataService', 'AlertaService', '$state',
            '$window', 'SecurityDataService', 'APP_INFO', 'ENV'];

        function UserEmpresaController($q, $log, CredentialsDataService: ICredentialsDataService, UserInfoDataService, UsuarioGestionDataService, AlertaService: IAlertaService, $state,
            $window: angular.IWindowService,
            SecurityDataService: ISecurityDataService, APP, ENV) {
            /* ------------------------------------------------ LOG ------------------------------------------------ */

            $log = $log.getInstance('UserEmpresaController');
            $log.debug('ON.-');

            /* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

            var vm = this;
            vm.today = new Date();

            /* Component Events */
            vm.$onInit = activate;
            // vm.$onChanges = updateComponent;

            vm.rowClick = rowClick;

            vm.changeEmpresa = changeEmpresa;

            vm.whiteClass = false;

            /* ---------------------------------------------- SUPPORT ----------------------------------------------- */

            function rowClick(row) {
            }

            function getEmpresaDefault(empresas) {
                var ret;

                angular.forEach(empresas, function (empresa, key) {
                    if (empresa.PorDefecto) {
                        ret = empresa;
                    }
                });

                return ret;
            }

            function cleanPorDefecto() {
                angular.forEach(vm.empresasList, function (empresa, key) {
                    empresa.PorDefecto = false;
                });
            }

            function changeEmpresa(empresaToSwitch) {            
                var _empresa = angular.copy(empresaToSwitch);
                cleanPorDefecto();
                //$log.debug('$changeEmpresa', empresaToSwitch);
                empresaToSwitch.PorDefecto = angular.copy(_empresa.PorDefecto);
                var data = CredentialsDataService.GetForce();
                data.IdEmpresa = empresaToSwitch.IdEmpresa;
                vm.nombre_empresa = empresaToSwitch.NombreEmpresa;
                

                //tengo que armar un objeto nuevo para cambiar el token
                const _data = {
                    companyId: data.IdEmpresa,
                    authData: {
                        accessToken: data.fr._fra,
                        refreshToken: data.fr._frr
                    }
			        
                }

                //llamamos al security data service
                SecurityDataService.RefreshToken(_data)
                    .then(function (pTokenRefresh) {    
                        //$log.debug('tokenRefresh', pTokenRefresh);
                        CredentialsDataService.Update(pTokenRefresh);                        
                        //var user = CredentialsDataService.GetForce();
                        UserInfoDataService.Get(data.userName)
                            .then(pUserInfo => {
                                CredentialsDataService.SetInfo(pUserInfo);
                                //User.modules = pUserInfo.modules;
                                CredentialsDataService.changeEmpresa(vm.empresasList);                                
                                AlertaService.NewSuccess("Completado", "Cambio de empresa exitoso");
                                $state.go('homesistemas')
                                setTimeout(() => {
                                    
                                    window.location.reload();   
                                }, 500);
                                
                                //$state.reload(true);
                                //$state.go('homesistemas')
                            });
                        }, function (pError) {
                            AlertaService.NewError("Error", pError)
                            //error en cambiar empresa
                    });
            }
            
            /* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

            function activate() {
                //$log.debug('$onInit');

                if (ENV.NAME == "production") { 
                    vm.whiteClass = true;
                }

                CredentialsDataService.Get().then(getUserOk, getUserError);

                function getUserOk(pUser) {
                    //$log.debug('$getUserOkEmpresa', pUser);

                    if (!angular.isUndefined(pUser.empresas)) {
                        vm.show = true;
                        vm.empresasList = angular.copy(pUser.empresas);
                        vm.empresa = getEmpresaDefault(vm.empresasList);
                        vm.nombre_empresa = vm.empresa.NombreEmpresa;
                    } else getUserError(false);
                }

                function getUserError(pError) {
                    vm.error = true;
                    vm.show = false;
                }
            }
        }
    };

    return module;
})();