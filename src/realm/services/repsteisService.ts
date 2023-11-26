import { RepteisType } from '../../shared/types/RepteisType';
import { realmInstance } from './databaseService';

export const salvarRepteis = (repteis: RepteisType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                repteis.forEach(reptil => {
                    const reptilCorrigido = {
                        ...reptil,
                        benfeitoria: reptil.benfeitoria.id 
                      };

                    realmInstance.create('Repteis', reptilCorrigido, true);
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const getRepteis = (benfeitoria: number): RepteisType[] => {
    const query = `benfeitoria == ${benfeitoria}`;

    const repteisRealm = realmInstance.objects<RepteisType>('Repteis').filtered(query).slice();

    const repteisCorrigidos = JSON.parse(JSON.stringify(repteisRealm));

    return repteisCorrigidos as RepteisType[];
};
