import { AvesType } from '../../shared/types/AvesType';
import { realmInstance } from './databaseService';

export const salvarAves = (aves: AvesType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                aves.forEach(ave => {
                    const aveCorrigida = {
                        ...ave,
                        benfeitoria: ave.benfeitoria.id
                    };

                    realmInstance.create('Aves', aveCorrigida, true);
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const getAves = (benfeitoria: number): AvesType[] => {
    const query = `benfeitoria == ${benfeitoria}`;

    const avesRealm = realmInstance.objects<AvesType>('Aves').filtered(query).slice();

    const avesCorrigidas = JSON.parse(JSON.stringify(avesRealm));

    return avesCorrigidas as AvesType[];
};
