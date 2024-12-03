import { MetodoTratamentoAgua } from "../../enums/MetodoTratamentoAgua.enum";
import { PocoEnum } from "../../enums/Poco.enum";
import { QualidadeAguaEnum } from "../../enums/qualidadeAgua.enum";
import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface AguaInput {
    
    possuiForneceimentoPublico: SimNaoTalvez|null|'';
    qualidadeFornecimentoPublico: QualidadeAguaEnum|null|'';
    corAguaForncimentoPublico: string;
    saborAguaFornecimentoPublico: string;
    cheiroAguaFornecimentoPublico: string;
    poco: PocoEnum|null|'';
    profundidadePoco: number;
    corAguaPoco: string;
    saborAguaPoco: string;
    cheiroAguaPoco: string;
    tratamentoAgua: MetodoTratamentoAgua|null|'';
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}