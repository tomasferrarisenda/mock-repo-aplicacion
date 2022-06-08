import * as angular from 'angular';
import { AboutController } from "./AboutController";
const aboutTemplate = require("./about.html");

const AboutComponent : angular.IComponentOptions = {
    template: aboutTemplate,
    controller: AboutController,
    controllerAs: 'about'
}

export default class {
    static init(ngModule: angular.IModule) {
        ngModule.component('saAbout', AboutComponent);
    }
}