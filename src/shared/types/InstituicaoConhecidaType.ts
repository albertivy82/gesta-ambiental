export interface InstituicaoConhecidaType {
    id: number;
    nome: string;
    atividades: string;
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}