import { AtividadeProdutivaType } from '../../shared/types/AtividadeProdutiva'; // Supondo a existência deste tipo
import { realmInstance } from './databaseService';

export const salvarAtividadeProdutiva = (atividades: AtividadeProdutivaType[]): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                atividades.forEach(atividade => {
                    const atividadeCorrigida = {
                        ...atividade,
                        benfeitoria: atividade.benfeitoria.id 
                    };
                    realmInstance.create('AtividadeProdutiva', atividadeCorrigida, true);
                });
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}

export const getAtividadesProdutivas = (benfeitoria: number): AtividadeProdutivaType[] => {
    const query = `benfeitoria == ${benfeitoria}`;
    const atividadesProdutivasRealm = realmInstance.objects<AtividadeProdutivaType>('AtividadeProdutiva').filtered(query).slice();
    const atividadesProdutivasLimpos = JSON.parse(JSON.stringify(atividadesProdutivasRealm));
    return atividadesProdutivasLimpos as AtividadeProdutivaType[];
};
