export interface CreditoType {
    id: number;
    nome: string;
    valor: number; 
    benfeitoria: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
