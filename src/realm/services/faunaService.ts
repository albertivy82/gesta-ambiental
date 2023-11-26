import { FaunaType } from '../../shared/types/FaunaType';
import { realmInstance } from './databaseService';

export const salvarFauna = (faunas: FaunaType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                faunas.forEach(fauna => {
                    const faunaCorrigida = {
                        ...fauna,
                        benfeitoria: fauna.benfeitoria.id
                    };

                    realmInstance.create('Fauna', faunaCorrigida, true);
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const getFaunas = (benfeitoria: number): FaunaType[] => {
    const query = `benfeitoria == ${benfeitoria}`;

    const faunasRealm = realmInstance.objects<FaunaType>('Fauna').filtered(query).slice();

    const faunasCorrigidas = JSON.parse(JSON.stringify(faunasRealm));

    return faunasCorrigidas as FaunaType[];
};
