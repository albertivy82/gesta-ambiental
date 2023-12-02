
import { DoencaType } from '../../shared/types/DoencaType';
import { realmInstance } from './databaseService';

export const salvarDoenca = (doencas: DoencaType[]): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                doencas.forEach(doenca => {
                   realmInstance.create('Doenca', doenca, true);
                });
                resolve();
            });
        } catch (error) {
            reject();
        }
    });
}

export const getDoencas = (morador: number): DoencaType[] => {
    
    const query = `morador == ${morador}`;
    const doencasRealm = realmInstance.objects<DoencaType>('Doenca').filtered(query).slice();
    const doencasLimpos = JSON.parse(JSON.stringify(doencasRealm));
    return doencasLimpos as DoencaType[];
};
