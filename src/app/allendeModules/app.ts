/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulos de Allende
 * @type:			Module
 **/
import * as angular from 'angular';

import { AlertaModule } from './alerta';
import { BasicoModule } from './basicos';
import { CamaModule } from './cama';
import { ConsultorioMedicoModule } from './consultorioMedico';
import { EnfermeriaModule } from './enfermeria';
import { FarmaciaModule } from './farmacia';
import { FacturacionModule } from './facturacion';
import { FinanciadorModule } from './financiadores';
import { GuardiaModule } from './guardia';
// import "./historiaClinica/app"; dejar comentado, disculpaaaaaaa mansilla
import { IntegracionModule } from './integraciones';
import { InternacionModule } from './internacion';
import { LiquidacionHonorariosModule } from './liquidacionHonorarios';
import { NomencladorModule } from './nomenclador';
import { PersonaModule } from './persona';
import { ProfesionalModule } from './profesionales';
import { RecepcionTurnosModule } from './recepcionTurnos';
import { RegistroLegacyModule } from './registroLegacy';
import { RepoFrontModule } from './repoFront';
import { SeguridadModule } from './seguridad';
import { StockModule } from './stockPorPiso';
import { AllendeSupportModule } from './support';
import { TurnoModule } from './turnos';

const modules: angular.IModule[] = [
	AlertaModule,
	BasicoModule,
	CamaModule,
	ConsultorioMedicoModule,
	EnfermeriaModule,
	FarmaciaModule,
	FacturacionModule,
	FinanciadorModule,
	GuardiaModule,
	// 'historiaClinica', dejar comentado
	IntegracionModule,
	InternacionModule,
	LiquidacionHonorariosModule,
	NomencladorModule,
	PersonaModule,
	ProfesionalModule,
	RecepcionTurnosModule,
	RegistroLegacyModule,
	RepoFrontModule,
	SeguridadModule,
	StockModule,
	AllendeSupportModule,
	TurnoModule
];

export const AllendeModulesModule = angular.module('allende.modules', modules.map(m => m.name))
	.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod ($log) {
	$log = $log.getInstance('Allende.Modules');
	$log.debug('ON.-');
}