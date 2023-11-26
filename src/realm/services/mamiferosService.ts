import { MamiferosType } from '../../shared/types/MamiferosType';
import { realmInstance } from './databaseService';

export const salvarMamiferos = (mamiferos: MamiferosType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                mamiferos.forEach(mamifero => {
                    const mamiferoCorrigido = {
                        ...mamifero,
                        benfeitoria: mamifero.benfeitoria.id
                    };

                    realmInstance.create('Mamiferos', mamiferoCorrigido, true);
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const getMamiferos = (benfeitoria: number): MamiferosType[] => {
    const query = `benfeitoria == ${benfeitoria}`;

    const mamiferosRealm = realmInstance.objects<MamiferosType>('Mamiferos').filtered(query).slice();

    const mamiferosCorrigidos = JSON.parse(JSON.stringify(mamiferosRealm));

    return mamiferosCorrigidos as MamiferosType[];
};
