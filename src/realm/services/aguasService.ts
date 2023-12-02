import { AguaType } from '../../shared/types/AguaType';
import { realmInstance } from './databaseService';

export const salvarAgua = (agua: AguaType) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
               
                    const aguaCorrigida = {
                        ...agua,
                        benfeitoria: agua.benfeitoria.id
                    };

                    realmInstance.create('Agua', aguaCorrigida, true);
            });
            
        } catch (error) {
            reject(error);
        }
    });
};

export const getAguas = (benfeitoria: number): AguaType => {
    const query = `benfeitoria == ${benfeitoria}`;

    const aguasRealm = realmInstance.objects<AguaType>('Agua').filtered(query).slice();

    const aguasCorrigidas = JSON.parse(JSON.stringify(aguasRealm));

    return aguasCorrigidas as AguaType;
};
