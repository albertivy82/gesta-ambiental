import { RendaOutrasFontesType } from '../../shared/types/RendaOutrasFontes'; // Supondo a existência deste tipo
import { realmInstance } from './databaseService';

export const salvarRendaOutrasFontes = (rendas: RendaOutrasFontesType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                rendas.forEach(renda => {
                    const rendaCorrigida = {
                        ...renda,
                        benfeitoria: renda.benfeitoria.id
                    };
                    realmInstance.create('RendaOutrasFontes', rendaCorrigida, true);
                });
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}

export const getRendasOutrasFontes = (benfeitoria: number): RendaOutrasFontesType[] => {
    const query = `benfeitoria == ${benfeitoria}`;
    const rendasRealm = realmInstance.objects<RendaOutrasFontesType>('RendaOutrasFontes').filtered(query).slice();
    const rendasLimpos = JSON.parse(JSON.stringify(rendasRealm));
    return rendasLimpos as RendaOutrasFontesType[];
};
