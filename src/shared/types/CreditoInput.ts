export interface CreditoInput {
    
    nome: string;
    valor: string; 
    benfeitoria?: {
        id: number;
    };
    sincronizado?: boolean;
    idLocal?: string;
    idFather?:string;
}
