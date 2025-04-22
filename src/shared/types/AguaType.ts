
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