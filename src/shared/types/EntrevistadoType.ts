import { alimento } from "../../enums/Alimento.enum";
import { Escolaridade } from "../../enums/Escolaridade";
import { EstadoCivil } from "../../enums/EstadoCivil.enum";
import { Sexo } from "../../enums/Sexo";
import { SimNao } from "../../enums/simNao.enum";
import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface EntrevistadoType {

id: number;
nome: string;
naturalidade: string;
nascimentoData: string;
sexo: Sexo| "" | null;
apelido: string;
escolaridade: Escolaridade| "" | null;
estadoCivil: EstadoCivil| "" | null;
religiao: string;
morador: SimNao| "" | null;
dataChegada: string;
pretendeMudar: SimNaoTalvez | "" | null;
motivoVontadeMudanca: string;
relacaoAreaImovel: string;
relacaoVizinhos: string;
tipoAlimentacao: string;
localCompras: string;
servicosDeficitarios: string;
sofreuAssaltos: number;
presenciouAssalto: number;
problemasDeViolenciaLocal: string;
conheceUcs: SimNao| "" | null;
conheceUcProposta: SimNao| "" | null;
conheceAreaUc: SimNao;
utilizaAreaUc: String;
propostaMelhorarArea: string;
indicadoConsultaPublica: string;
contatoIndicadoConsultaPublica: string;
localidade: {
    id: number;
};
sincronizado: boolean;
idLocal?: string;
}




