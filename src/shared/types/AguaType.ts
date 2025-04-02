import { MetodoTratamentoAgua } from "../../enums/MetodoTratamentoAgua.enum";
import { PocoEnum } from "../../enums/Poco.enum";
import { QualidadeAguaEnum } from "../../enums/qualidadeAgua.enum";
import { SimNaoTalvez } from "../../enums/simNaoTalvez.enum";

export interface AguaType {
    id: number;
    tipoDeFornecimento: string;
    qualidadeDaAgua: string;
    metodoTratamento: string;
    corDagua: string;
    cheiroDagua: string;
    saborDagua: string;
    profundidadePoco?: number;
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}