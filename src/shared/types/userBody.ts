
export interface UserBody {
    id: number;
    nome: string;
    matricula: string;
    email: string;
    cpf: string;
    grupo: {
        nome: string;
    }
}