import { SimNao } from "../../enums/simNao.enum";


export interface VegetacaoInput {
       especie:string;
       usoMedicinal: SimNao | null | '';
       usoAlimentacao: SimNao | null | '';
       usoOrnamental: SimNao | null | '';
       usoComercial: SimNao | null | '';
       usaFlor: SimNao | null | '';
       usaFolha: SimNao | null | '';
       usaSemente: SimNao | null | '';
       usaFruto: SimNao | null | '';
       usaCasca: SimNao | null | '';
       usaRaiz: SimNao | null | '';
       usoLeiteLatex: SimNao | null | '';
       outrosUsos: string;
       coletaLocalPublico: SimNao | null | '';
       coletaCultivo: SimNao | null | '';
       coletaCompra: SimNao | null | '';
       coletaAmbienteEspecifica: SimNao | null | '';
       quemEnsinouUso: string;
       repassaConhecimento: string;
       observacoesEspontaneas: string;
       entrevistado: {
           id: number;
       };
       sincronizado?: boolean;
       idLocal?: string;
       idFather?:string;
}
