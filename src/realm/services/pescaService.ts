
import { PescaArtesanalType } from '../../shared/types/PescaArtesanal';
import { realmInstance } from './databaseService';

export const salvarPescaArtesanal = (pescasArtesanais: PescaArtesanalType[]): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                pescasArtesanais.forEach(pescaArtesanal => {
                    const pescaCorrigida = {
                        ...pescaArtesanal,
                        benfeitoria: pescaArtesanal.benfeitoria.id
                    }
                    realmInstance.create('PescaArtesanal', pescaArtesanal, true);
                });
                resolve();
            });
        } catch (error) {
            reject();
        }
    })
}

export const getPescasArtesanais = (benfeitoria: number): PescaArtesanalType[] => {
    const query = `benfeitoria == ${benfeitoria}`;
    const pescasArtesanaisRealm = realmInstance.objects<PescaArtesanalType>('PescaArtesanal').filtered(query).slice();
    const pescasArtesanaisLimpos = JSON.parse(JSON.stringify(pescasArtesanaisRealm));
    return pescasArtesanaisLimpos as PescaArtesanalType[];
};