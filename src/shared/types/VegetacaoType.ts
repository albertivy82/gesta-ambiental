import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface VegetacaoType {
    id: number;
    usoMedicinal: SimNaoTalvez | null | '';
    usoAlimentacao: SimNaoTalvez | null | '';
    usoOrnamental: SimNaoTalvez | null | '';
    usoComercial: SimNaoTalvez | null | '';
    usaFlor: SimNaoTalvez | null | '';
    usaFolha: SimNaoTalvez | null | '';
    usaSemente: SimNaoTalvez | null | '';
    usaFruto: SimNaoTalvez | null | '';
    usaCasca: SimNaoTalvez | null | '';
    usaRaiz: SimNaoTalvez | null | '';
    usoLeiteLatex: SimNaoTalvez | null | '';
    outrosUsos: SimNaoTalvez | null | '';
    coletaLocalPublico: SimNaoTalvez | null | '';
    coletaCultivo: SimNaoTalvez | null | '';
    coletaCompra: SimNaoTalvez | null | '';
    coletaAmbienteEspecifica: SimNaoTalvez | null | '';
    quemEnsinouUso: string;
    repassaConhecimento: string;
    observacoesEspontaneas: string;
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
