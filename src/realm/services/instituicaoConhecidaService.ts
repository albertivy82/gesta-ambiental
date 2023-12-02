import { InstituicaoConhecidaType } from '../../shared/types/InstituicaoConhecida'; // Supondo a existência deste tipo
import { realmInstance } from './databaseService';

export const salvarInstituicaoConhecida = (instituicoes: InstituicaoConhecidaType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                instituicoes.forEach(instituicao => {
                    const instituicaoCorrigida = {
                        ...instituicao,
                        benfeitoria: instituicao.benfeitoria.id // Supondo que benfeitoria é um objeto com um id
                    };
                    realmInstance.create('InstituicaoConhecida', instituicaoCorrigida, true);
                });
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}

export const getInstituicoesConhecidas = (benfeitoria: number): InstituicaoConhecidaType[] => {
    const query = `benfeitoria == ${benfeitoria}`;
    const instituicoesConhecidasRealm = realmInstance.objects<InstituicaoConhecidaType>('InstituicaoConhecida').filtered(query).slice();
    const instituicoesConhecidasLimpos = JSON.parse(JSON.stringify(instituicoesConhecidasRealm));
    return instituicoesConhecidasLimpos as InstituicaoConhecidaType[];
};
