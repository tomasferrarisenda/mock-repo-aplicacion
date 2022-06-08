import { IMedicamentoAFacturar } from "./MedicamentoAFacturar";

export interface IFacturarMedicamentoInternadoDto {
	IdUsuario ?: number,
	IdInternacion ?: number,
	Medicamentos?: Array<IMedicamentoAFacturar>,
	IdModoEntrega?: number
}