import { PeixesType } from '../../shared/types/PeixesType';
import { realmInstance } from './databaseService';

export const salvarPeixes = (peixes: PeixesType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                peixes.forEach(peixe => {
                    const peixeCorrigido = {
                        ...peixe,
                        benfeitoria: peixe.benfeitoria.id 
                    };

                    realmInstance.create('Peixes', peixeCorrigido, true);
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const getPeixes = (benfeitoria: number): PeixesType[] => {
    const query = `benfeitoria == ${benfeitoria}`;

    const peixesRealm = realmInstance.objects<PeixesType>('Peixes').filtered(query).slice();

    const cleanPeixes = JSON.parse(JSON.stringify(peixesRealm));

    return cleanPeixes as PeixesType[];

}
