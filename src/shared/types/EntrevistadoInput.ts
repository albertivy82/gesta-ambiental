import { EstadoCivil } from "../../enums/EstadoCivil.enum";
import { Sexo } from "../../enums/Sexo";
import { SimNao } from "../../enums/simNao.enum";
import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface EntrevistadoInput {

    nome: string;
    naturalidade: string;
    nascimentoData: number;
    sexo: Sexo | "" | null;
    apelido: string;
    escolaridade: string;
    estadoCivil: EstadoCivil | "" | null;
    religiao: string;
    morador: SimNao | "" | null;
    dataChegada: string;
    pretendeMudar: SimNaoTalvez | "" | null;
    motivoVontadeMudanca: string;
    relacaoAreaImovel: string;
    relacaoVizinhos: string;
    tipoAlimentacao: string;
    localCompras: string;
    comoCuidaSaudeFamilia: string;
    servicosDeficitarios: string;
    sofreuAssaltos: number;
    presenciouAssalto: number;
    problemasDeViolenciaLocal: string;
    instituicaoConhecida: string;
    importanciaDeProtegerAmbiente: string;
    importanciaDeProtegerFauna: string;
    qualEspacoPrecisaSerPreservado: string;
    problemasRelacionadosAoAmbiente: string;
    conheceUcs: SimNao | "" | null;
    conheceUcProposta: SimNao | "" | null;
    conheceAreaUc: SimNao | "" | null;
    utilizaAreaUc: string;
    propostaMelhorarArea: string;
    indicadoConsultaPublica: string;
    contatoIndicadoConsultaPublica: string;
    localidade: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
}



