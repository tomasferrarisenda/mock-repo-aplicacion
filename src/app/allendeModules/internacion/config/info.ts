import * as angular from 'angular';
(function () {
    'use strict';
    angular.module('internacion.info', [])
    .constant('INTERNACION_INFO', {name:'internacion',title:'INTERNACIÓN',description:'Aplicación de preadmisión, admisión y gestión de internados.',main:'dist/app.js',keywords:['internacion','admision','preadmision','app'],authors:'emansilla',private:true,license:'UNLICENSED',version:'1.1.7',devDependencies:{bower:'^1.7.9',grunt:'^1.0.1','grunt-cli':'^1.2.0','grunt-contrib-clean':'^1.0.0','grunt-contrib-htmlmin':'^1.4.0','grunt-contrib-uglify':'^1.0.1','grunt-html2js':'^0.3.6','grunt-ng-constant':'^2.0.1','grunt-shell':'^1.3.0'},scripts:{prestart:'npm install',postinstall:'bower install'}})
; 
})();