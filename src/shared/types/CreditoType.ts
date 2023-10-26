export interface CreditoType {
    id: number;
    entrevistadoId: number;
    valor: number;
    fonte: string;
    finalidade: string;
    foiPago: boolean;
}
