import { AtendimentoSaudeType } from '../../shared/types/AtendmentoSaudeType';
import { realmInstance } from './databaseService';

export const salvarAtendimentoSaude = (atendimentos: AtendimentoSaudeType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                atendimentos.forEach(atendimento => {
                    realmInstance.create('AtendimentoSaude', atendimento, true);
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getAtendimentoSaudePorImovel = (imovel: number): AtendimentoSaudeType[] => {
    const query = `imoveis.id == ${imovel}`;

    const atendimentos = realmInstance.objects<AtendimentoSaudeType>('AtendimentoSaude').filtered(query).slice();

    const cleanAtendimentos = JSON.parse(JSON.stringify(atendimentos));

    return cleanAtendimentos as AtendimentoSaudeType[];
};
