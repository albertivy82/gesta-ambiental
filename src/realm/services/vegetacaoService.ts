import { VegetacaoType } from '../../shared/types/VegetacaoType';
import { realmInstance } from './databaseService';

export const salvarVegetacao = (vegetacoes: VegetacaoType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                vegetacoes.forEach(vegetacao => {
                    const vegetacaoCorrigida = {
                        ...vegetacao,
                        benfeitoria: vegetacao.benfeitoria.id 
                    };

                    realmInstance.create('Vegetacao', vegetacaoCorrigida, true);
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const getVegetacoes = (benfeitoria: number): VegetacaoType[] => {
    const query = `benfeitoria == ${benfeitoria}`;

    const vegetacoesRealm = realmInstance.objects<VegetacaoType>('Vegetacao').filtered(query).slice();

    const vegetacoesCorrigidas = JSON.parse(JSON.stringify(vegetacoesRealm));

    return vegetacoesCorrigidas as VegetacaoType[];
};
