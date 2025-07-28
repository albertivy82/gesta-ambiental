export interface CreditoType {
    id: number;
    nome: string;
    valor: string; 
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
